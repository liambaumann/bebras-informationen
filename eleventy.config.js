import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import { HtmlBasePlugin } from "@11ty/eleventy";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
// for markdown
import markdownItClass from "@toycode/markdown-it-class";
import markdownIt from "markdown-it";

//for tailwind
import path from 'path';
import fs from 'fs';

import cssnano from 'cssnano';
import postcss from 'postcss';
import tailwindcss from '@tailwindcss/postcss';


export default function (eleventyConfig) {
	// Order matters, put this at the top of your configuration file.
  	//eleventyConfig.setOutputDirectory("jw");
	
	eleventyConfig.on('eleventy.before', async () => {
		//take from src's index.css
		const tailwindInputPath = path.resolve('./assets/css/index.css')
		//copy it later to dist's index.css (which is what is "deployed")
		const tailwindOutputPath = path.resolve('./_site/assets/css/index.css');

		const cssContent = fs.readFileSync(tailwindInputPath, 'utf-8');
		const outputDir = path.dirname(tailwindOutputPath);

		// if the output directory doesn't exist, create it
		if (!fs.existsSync(outputDir)) {
			fs.mkdirSync(outputDir, { recursive: true });
		}

		// let postcss ? process tailwind, with cssnano for minification??
		const result = await processor.process(cssContent, {
			from: tailwindInputPath,
			to: tailwindOutputPath
		})

		// Processor creates result.css as output by default, we write that to dist/index.css
		// (.css is actually not a filename but a property of const result)
		fs.writeFileSync(tailwindOutputPath, result.css);
	})

	const processor = postcss([
		// compile tailwind
		tailwindcss(),

		//minify with cssnano
		cssnano({
			preset: 'default',
		})
	])

	eleventyConfig.addPlugin(eleventyImageTransformPlugin);
	eleventyConfig.addPlugin(syntaxHighlight);

	// Add base plugin to handle pathPrefix correctly
	eleventyConfig.addPlugin(HtmlBasePlugin);

	// Make eleventy automatically add "assets/css/output.css" to our eventual output folder
	// we don't need this anymore with our index.css???
	//eleventyConfig.addPassthroughCopy("assets/css/index.css");
	// Passthrough images too
	eleventyConfig.addPassthroughCopy("assets/img");
	// passthrough pdf folder
	eleventyConfig.addPassthroughCopy("assets/pdf");

	// passthrough media (images)
	eleventyConfig.addPassthroughCopy("pages/media");


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
		h3: ['text-xl', 'font-semibold', 'my-3'],
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


// HIER MUSS DER SUBPFAD ANGEGEBEN WERDEN
export const config = {
	pathPrefix: "/jw/",
}