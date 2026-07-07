const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

const replacements = [
    // Backgrounds
    { regex: /\bbg-gray-900\b/g, replacement: 'bg-foreground' },
    { regex: /\bbg-gray-800\b/g, replacement: 'bg-foreground' },
    { regex: /\bbg-gray-700\b/g, replacement: 'bg-foreground' },
    { regex: /\bbg-gray-600\b/g, replacement: 'bg-muted-foreground' },
    { regex: /\bbg-gray-500\b/g, replacement: 'bg-muted-foreground' },
    { regex: /\bbg-gray-400\b/g, replacement: 'bg-muted-foreground' },
    { regex: /\bbg-gray-300\b/g, replacement: 'bg-border' },
    { regex: /\bbg-gray-200\b/g, replacement: 'bg-muted' },
    { regex: /\bbg-gray-100\b/g, replacement: 'bg-muted' },
    { regex: /\bbg-gray-50\b/g, replacement: 'bg-surface-soft' },
    { regex: /\bbg-white\b/g, replacement: 'bg-surface' },

    // Text
    { regex: /\btext-gray-900\b/g, replacement: 'text-foreground' },
    { regex: /\btext-gray-800\b/g, replacement: 'text-foreground' },
    { regex: /\btext-gray-700\b/g, replacement: 'text-foreground' },
    { regex: /\btext-gray-600\b/g, replacement: 'text-muted-foreground' },
    { regex: /\btext-gray-500\b/g, replacement: 'text-muted-foreground' },
    { regex: /\btext-gray-400\b/g, replacement: 'text-muted-foreground' },
    { regex: /\btext-gray-300\b/g, replacement: 'text-border' },
    { regex: /\btext-gray-200\b/g, replacement: 'text-muted' },
    { regex: /\btext-gray-100\b/g, replacement: 'text-surface' },
    { regex: /\btext-gray-50\b/g, replacement: 'text-surface' },
    { regex: /\btext-white\b/g, replacement: 'text-primary-foreground' },

    // Borders
    { regex: /\bborder-gray-[0-9]{2,3}\b/g, replacement: 'border-border' },

    // Primary equivalents (violet, purple, pink, blue, sky) -> primary
    { regex: /\b(bg|text|border|from|to|via|hover:bg|hover:text)-(violet|purple|pink|blue|sky)-[0-9]{2,3}\b/g, replacement: (match, p1) => `${p1}-primary` },
    
    // Accent equivalents (amber, yellow, orange) -> accent
    { regex: /\b(bg|text|border|from|to|via|hover:bg|hover:text)-(amber|yellow|orange)-[0-9]{2,3}\b/g, replacement: (match, p1) => `${p1}-accent` },

    // Success equivalents (emerald, teal, green) -> success
    { regex: /\b(bg|text|border|from|to|via|hover:bg|hover:text)-(emerald|teal|green)-[0-9]{2,3}\b/g, replacement: (match, p1) => `${p1}-success` },

    // Destructive equivalents (red, rose) -> destructive
    // Wait, earlier I mapped rose to primary. Let's stick with red -> destructive
    { regex: /\b(bg|text|border|from|to|via|hover:bg|hover:text)-(red|rose)-[0-9]{2,3}\b/g, replacement: (match, p1) => `${p1}-destructive` },
    
    // Grays with opacity
    { regex: /\bfrom-gray-50\/[0-9]+\b/g, replacement: 'from-surface-soft' },
    
    // Arbitrary tailwind values / Hex codes
    { regex: /\bbg-\[#1f1f1f\]/g, replacement: 'bg-foreground' },
    { regex: /\btext-\[#1f1f1f\]/g, replacement: 'text-foreground' },
    { regex: /\bbg-\[#1A1512\]/g, replacement: 'bg-foreground' },
    { regex: /\btext-\[#1A1512\]/g, replacement: 'text-foreground' },
    { regex: /\bbg-\[#4B0082\]/g, replacement: 'bg-primary' },
    { regex: /\btext-\[#C9A227\]/g, replacement: 'text-gold' },
    { regex: /\bbg-\[#C9A227\]/g, replacement: 'bg-gold' },
    { regex: /\btext-\[#E8D9A8\]/g, replacement: 'text-gold-light' },
    { regex: /\bbg-\[#E8D9A8\]/g, replacement: 'bg-gold-light' },

    // specific hex replacements in raw strings (e.g. fill="#C9A227")
    { regex: /"#C9A227"/g, replacement: '"var(--color-gold)"' },
    { regex: /'#C9A227'/g, replacement: "'var(--color-gold)'" },
    { regex: /"#E8D9A8"/g, replacement: '"var(--color-gold-light)"' },
    { regex: /'#E8D9A8'/g, replacement: "'var(--color-gold-light)'" },
    { regex: /"#1A1512"/g, replacement: '"var(--color-foreground)"' },
    { regex: /'#1A1512'/g, replacement: "'var(--color-foreground)'" },
    { regex: /"#1f1f1f"/g, replacement: '"var(--color-foreground)"' },
    { regex: /'#1f1f1f'/g, replacement: "'var(--color-foreground)'" },
    { regex: /#f43f5e/g, replacement: 'var(--color-primary)' },
    { regex: /#f97316/g, replacement: 'var(--color-accent)' },
];

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;
            
            for (const { regex, replacement } of replacements) {
                content = content.replace(regex, replacement);
            }

            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}

processDirectory(srcDir);
console.log('Done!');
