#!/usr/bin/env node

/**
 * Validate the repository's deterministic skill metadata and eval structure.
 * This intentionally avoids network access or an LLM provider.
 */
import { existsSync, readFileSync } from 'node:fs';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { glob } from 'glob';

const ROOT = resolve(dirname(new URL(import.meta.url).pathname), '..');
const SKILLS_ROOT = join(ROOT, 'skills');
const failures = [];

function fail(file, message) {
	failures.push(`${relative(ROOT, file)}: ${message}`);
}

function readFrontmatter(file) {
	const lines = readFileSync(file, 'utf8').split('\n');
	if (lines[0] !== '---') {
		fail(file, 'missing YAML frontmatter');
		return null;
	}

	const end = lines.indexOf('---', 1);
	if (end === -1) {
		fail(file, 'unterminated YAML frontmatter');
		return null;
	}

	const fields = {};
	for (const line of lines.slice(1, end)) {
		const match = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
		if (match) fields[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
	}
	return { fields, lines };
}

function validateMarkdownLinks(file) {
	const source = readFileSync(file, 'utf8');
	for (const match of source.matchAll(/\]\(([^)]+)\)/g)) {
		const target = match[1];
		if (/^(?:https?:|#)/.test(target)) continue;
		const targetPath = resolve(dirname(file), target);
		if (!existsSync(targetPath)) fail(file, `broken relative link: ${target}`);
	}
}

const skillFiles = glob.sync(join(SKILLS_ROOT, '*/SKILL.md'));
const skillNames = new Set();

for (const skillFile of skillFiles) {
	const skillDir = basename(dirname(skillFile));
	const parsed = readFrontmatter(skillFile);
	if (!parsed) continue;

	const { fields, lines } = parsed;
	if (fields.name !== skillDir) fail(skillFile, `frontmatter name must be ${skillDir}`);
	if (!fields.description) fail(skillFile, 'frontmatter description is required');
	if (skillNames.has(fields.name)) fail(skillFile, `duplicate skill name: ${fields.name}`);
	skillNames.add(fields.name);
	if (lines.length - 1 > 500) fail(skillFile, 'SKILL.md must be 500 lines or fewer');
	validateMarkdownLinks(skillFile);

	const evalFile = join(dirname(skillFile), 'evals', 'evals.json');
	if (!existsSync(evalFile)) {
		fail(skillFile, 'missing evals/evals.json');
		continue;
	}

	try {
		const evals = JSON.parse(readFileSync(evalFile, 'utf8'));
		if (!Array.isArray(evals) && !Array.isArray(evals.evals)) {
			fail(evalFile, 'must contain an eval array');
			continue;
		}
		for (const [index, evaluation] of (Array.isArray(evals) ? evals : evals.evals).entries()) {
			if (!evaluation.prompt) fail(evalFile, `eval ${index + 1} is missing prompt`);
			const expectations = evaluation.expectations ?? evaluation.assertions;
			if (!Array.isArray(expectations) || expectations.length === 0) {
				fail(evalFile, `eval ${index + 1} needs expectations or assertions`);
			}
		}
	} catch (error) {
		fail(evalFile, `invalid JSON: ${error.message}`);
	}
}

if (skillFiles.length === 0) fail(SKILLS_ROOT, 'no skills found');

if (failures.length > 0) {
	console.error(
		`Skill validation failed (${failures.length} issue${failures.length === 1 ? '' : 's'}):`,
	);
	for (const failure of failures) console.error(`- ${failure}`);
	process.exit(1);
}

console.log(`Validated ${skillFiles.length} skills, eval files, and relative Markdown links.`);
