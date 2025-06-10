import { App, Editor, MarkdownView, Plugin, Notice, PluginSettingTab, Setting  } from "obsidian";
import { BibleLinkerSettingsTab } from "./src/BibleLinkerSettingsTab"; // Import the settings tab
import { fetchVerse } from "./src/services/VerseFetcher"; // Import the verse fetching function
import { parseBibleReference } from "./src/utils/BibleReferenceParser"; // Import the Bible reference parser
import { formatBibleUrl, getUrlSafeBookName } from "./src/utils/BibleUrlFormatter"; // Import the URL formatter

interface BibleLinkerSettings {
    version: string; // e.g. "NIV",
    addPreview?: boolean; // Whether to add a preview of the verse
}

const DEFAULT_SETTINGS: BibleLinkerSettings = {
    version: "NIV", // Default version
    addPreview: true // Default to adding preview
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

        const parsedReference = parseBibleReference( selected );
        if ( !parsedReference ) {
            new Notice("Please select a valid Bible reference (e.g. John 3:16 or Song of Songs 2:4)");
            return;
        }
        const { bookName, verse } = parsedReference;

        // Get the URL-safe book name from the map
        const urlSafeBookName = getUrlSafeBookName( bookName );
        if ( !urlSafeBookName ) {
            new Notice( "Invalid book name or verse format. Please check your selection." );
            return;
        }

        const url = formatBibleUrl( urlSafeBookName, verse, this.settings.version );

        editor.replaceSelection( `[${ selected } (${ this.settings.version })](${ url })` );

        if ( !this.settings.addPreview ) {
            new Notice( "Verse linked successfully. Preview is disabled in settings." );
            return;
        }

        // Fetch and display the verse text
        fetchVerse( urlSafeBookName, verse )
            .then(verseText => {
                if (verseText && verseText.verses && verseText.verses.length > 0) {
                    const [chapter, verseNumber] = verse.split(":").map(Number);
                    const specificVerse = verseText.verses.find( (v: { chapter: number; verse: number; }) => v.chapter === chapter && v.verse === verseNumber );

                    if (!specificVerse) {
                        new Notice("Verse not found in the fetched data.");
                        return;
                    }

                    editor.replaceRange(
                        `\n> ${specificVerse.text}\n`,
                        editor.getCursor()
                    );
                } else {
                    new Notice("Verse text not found.");
                }
            } );
    }
}
