#!/usr/bin/env node

const { configure } = require('esbd');
const fs = require('node:fs/promises');
const { precompile } = require('handlebars');

function hbs() {
    return {
        name: 'handlebars',
        setup(build) {
            const compileOptions = {
                strict: true,
                noEscape: true,
                preventIndent: true,
                knownHelpersOnly: true,
                knownHelpers: {
                    ifdef: true,
                    equals: true,
                    notEquals: true,
                    containsSpaces: true,
                    union: true,
                    intersection: true,
                    enumerator: true,
                    escapeComment: true,
                    escapeDescription: true,
                    camelCase: true,
                    pascalCase: true,
                    queryKey: true,
                },
            };

            build.onLoad({ filter: /\.hbs$/i }, async ({ path: filename }) => {
                const source = await fs.readFile(filename, 'utf-8');
                try {
                    const templateSpec = precompile(source.trim(), compileOptions);
                    return { contents: `export default ${templateSpec};`, loader: 'js' };
                } catch (err) {
                    const esBuildError = { text: err.message };
                    return { errors: [esBuildError] };
                }
            });
        },
    };
}

configure({
    entryPoints: { index: 'src/index.ts' },
    outdir: 'dist',
    //packages: 'external',
    platform: 'node',
    plugins: [hbs()],
    sourcemap: false,
    target: 'node16',
});
