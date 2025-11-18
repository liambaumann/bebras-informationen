import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import markdownItClass from "@toycode/markdown-it-class";
import markdownIt from "markdown-it";

export default function (eleventyConfig) {
	eleventyConfig.addPlugin(eleventyImageTransformPlugin);
	eleventyConfig.addPlugin(syntaxHighlight);
	// Make eleventy automatically add "assets/css/output.css" to our eventual output folder
	eleventyConfig.addPassthroughCopy("assets/css/output.css");
	// Passthrough images too
	eleventyConfig.addPassthroughCopy("assets/images");

	// Shared ul and ol style classes
	const ulol = [
		'[&>li>ul]:ml-6',
		'[&>li>ul]:list-disc',
		'[&>li>ol]:ml-6',
		'[&>li>ol]:list-decimal',
		'list-inside',
		'my-2'
		];

	// Markdown style classes map (tailwind)
	const mapping = {
		h1: ['text-3xl', 'font-bold', 'my-4'],
		h2: ['text-2xl', 'font-semibold', 'my-3'],
		a: ['underline', 'hover:text-blue-800'],
		p: ['my-4', 'leading-relaxed'],

		//adding to ulol separate definitions:
		ul: [...ulol, 'list-disc'],
		ol: [...ulol, 'list-decimal'],
		img: ['my-4', 'mx-auto', 'rounded-lg', 'shadow-lg'],
	}

	const md = markdownIt({ linkify: true, html: true });
	md.use(markdownItClass, mapping);
	eleventyConfig.setLibrary('md', md);

};