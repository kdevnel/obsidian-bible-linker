import { App, Editor, MarkdownView, Plugin, Notice, PluginSettingTab, Setting  } from "obsidian";
import { BOOK_MAP, VERSION_MAP } from "./constants"; // Import the book name mapping

interface BibleLinkerSettings {
	version: string; // e.g. "KJV"
}

const DEFAULT_SETTINGS: BibleLinkerSettings = {
	version: "NIV" // Default version
};

export default class BibleLinkerPlugin extends Plugin {
    settings!: BibleLinkerSettings;

    async onload() {
        await this.loadSettings();

        // Register a command to link Bible verses
        this.addCommand({
            id: 'link-bible-reference',
            name: 'Link to Bible.com',
            editorCallback: (editor: Editor) => this.linkBibleReference(editor)
        });

        // Add a toolbar icon for linking Bible verses
        this.addRibbonIcon('book', 'Link Bible Reference', () => {
            const view = this.app.workspace.getActiveViewOfType(MarkdownView);
            if (view) {
                this.linkBibleReference(view.editor);
            }
        });

        // Add settings tab
        this.addSettingTab(new BibleLinkerSettingsTab(this.app, this));
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    linkBibleReference(editor: Editor) {
        const selected = editor.getSelection().trim();

		if (!selected.match(/^[1-3]?\s?[A-Za-z\s]+\s\d+:\d+(-\d+)?$/)) {
            new Notice("Please select a valid Bible reference (e.g. John 3:16 or Song of Songs 2:4)");
            return;
        }

        const parts = selected.split(/\s+/);

        // Join all parts except the last one
        // This accounts for book names with numbers or multiple words
        const bookName = parts.slice(0, -1).join(" ")
            .replace(/ /g, "") // Remove spaces for URL safety
            .toLowerCase() // Convert to lowercase for mapping
            .replace(/1st|2nd|3rd/g, (match) => match.replace(/st|nd|rd/g, '')); // Handle ordinal numbers
        const verse = parts[parts.length - 1];

        // Get the URL-safe book name from the map
        const urlSafeBookName = BOOK_MAP[bookName] || bookName.toUpperCase();

        if (!urlSafeBookName) {
            new Notice("Invalid book name. Please check your selection.");
            return;
        }

        const formattedPath = `${urlSafeBookName}.${verse.replace(":", ".")}`; // Bible.com format
        const versionID = VERSION_MAP[this.settings.version] || VERSION_MAP["NIV"]; // Default to NIV if not found
		const url = `https://www.bible.com/bible/${versionID}/${formattedPath}`;
		editor.replaceSelection(`[${selected}](${url})`);
	}
}

class BibleLinkerSettingsTab extends PluginSettingTab {
    plugin: BibleLinkerPlugin;

    constructor(app: App, plugin: BibleLinkerPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();
        containerEl.createEl('h2', { text: 'Bible Linker Settings' });

        new Setting(containerEl)
            .setName('Preferred Bible Version')
            .setDesc('Choose the default Bible version to use for links.')
            .addDropdown(dropdown => {
                Object.keys(VERSION_MAP).forEach(version =>
                    dropdown.addOption(version, version)
                );
                dropdown.setValue(this.plugin.settings.version);
                dropdown.onChange(async (value) => {
                        this.plugin.settings.version = value;
                        await this.plugin.saveSettings();
                });
            })
    }
}