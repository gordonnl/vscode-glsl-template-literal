import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { languages } from './languages.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getEmbedded() {
    return languages.reduce((out, language) => {
        out[`meta.embedded.block.${language.name}`] = language.language;
        return out;
    }, {});
}

export function updateEmbedded() {
    const packageJsonPath = path.join(__dirname, '..', 'package.json');
    const json = JSON.parse(fs.readFileSync(packageJsonPath).toString());
    json.contributes.grammars[0].embeddedLanguages = getEmbedded();
    fs.writeFileSync(packageJsonPath, JSON.stringify(json, null, 4));
}
