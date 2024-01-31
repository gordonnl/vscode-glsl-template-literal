import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { languages } from './languages.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetScopes = [
    'source.js',
    'source.jsx',
    'source.js.jsx',
    'source.ts',
    'source.tsx',
    'source.svelte',
    'source.svelte.js',
];

const basicGrammarTemplate = {
    fileTypes: [],
    injectionSelector: getBasicGrammarInjectionSelector(),
    patterns: [],
    scopeName: 'inline.template-tagged-languages',
};

function getBasicGrammarPattern(language) {
    const sources = Array.isArray(language.source) ? language.source : [language.source];
    return {
        name: `string.js.taggedTemplate.commentTaggedTemplateLiteral.${language.name}`,
        contentName: `meta.embedded.block.${language.name}`,

        // The leading '/' was consumed by outer rule
        begin: `(?i)(\\*\\s*\\b(?:${language.identifiers.map(escapeRegExp).join('|')})\\b\\s*\\*/)\\s*(\`)`,
        beginCaptures: {
            1: { name: 'comment.block.ts' },
            2: { name: 'punctuation.definition.string.template.begin.js' },
        },
        end: '(?=`)',
        patterns: [
            ...sources.map((source) => ({ include: source })),
            // When a language grammar is not installed, insert a phony pattern
            // so that we still match all the inner text but don't highlight it
            {
                match: '.',
            },
        ],
    };
}

function getBasicGrammar() {
    const basicGrammar = basicGrammarTemplate;

    basicGrammar.repository = languages.reduce((repository, language) => {
        repository[getRepositoryName(language)] = getBasicGrammarPattern(language);
        return repository;
    }, {});

    const allLanguageIdentifiers = [].concat(...languages.map((x) => x.identifiers));
    basicGrammar.patterns = [
        {
            // Match entire language comment identifier but only consume '/'
            begin: `(?i)(/)(?=(\\*\\s*\\b(?:${allLanguageIdentifiers
                .map(escapeRegExp)
                .join('|')})\\b\\s*\\*/)\\s*\`)`,
            beginCaptures: {
                1: { name: 'comment.block.ts' },
            },
            end: '(`)',
            endCaptures: {
                0: { name: 'string.js' },
                1: { name: 'punctuation.definition.string.template.end.js' },
            },
            patterns: languages.map((language) => ({ include: '#' + getRepositoryName(language) })),
        },
    ];

    return basicGrammar;
}

function getRepositoryName(langauge) {
    return 'commentTaggedTemplateLiteral-' + langauge.name;
}

function getBasicGrammarInjectionSelector() {
    return targetScopes.map((scope) => `L:${scope} -comment -(string - meta.embedded)`).join(', ');
}

function escapeRegExp(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

function writeJson(outFile, json) {
    fs.writeFileSync(outFile, JSON.stringify(json, null, 4));
}

export function updateGrammars() {
    const outDir = path.join(__dirname, '..', 'syntaxes');
    writeJson(path.join(outDir, 'grammar.json'), getBasicGrammar());
}
