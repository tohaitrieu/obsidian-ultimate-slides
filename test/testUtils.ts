import { parse as parseYaml } from 'yaml';
import type { Options } from '../src/@types';

export function prepare(input: string): { options: Options; markdown: string } {
	const { yamlOptions, markdown } = parseYamlFrontMatter(input);
	const options = getSlideOptions(yamlOptions);
	return { options, markdown };
}

function parseYamlFrontMatter(input: string): {
	yamlOptions: unknown;
	markdown: string;
} {
	const content = input.replace(/^﻿/, '');
	const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;
	const match = content.match(frontmatterRegex);

	if (!match) {
		return {
			yamlOptions: {},
			markdown: content,
		};
	}

	const yamlContent = match[1];
	const markdown = match[2];
	const yamlOptions = parseYaml(yamlContent) || {};

	return {
		yamlOptions,
		markdown,
	};
}

export function getSlideOptions(options: unknown): Options {
	return Object.assign({}, {
		theme: 'black',
		highlightTheme: 'zenburn',
		template: 'template/reveal.html',
		separator: '\r?\n---\r?\n',
		verticalSeparator: '\r?\n--\r?\n',
		enableLinks: false,
		width: 960,
		height: 700,
		margin: 0.04,
	}, options as Record<string, unknown>) as Options;
}
