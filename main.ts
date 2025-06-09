import { App, Editor, MarkdownView, Plugin, Notice, PluginManifest } from "obsidian";

export default class BibleLinkerPlugin extends Plugin {
    async onload() {
        // Register a command to link Bible verses
        this.addCommand({
            id: 'link-bible-verses',
            name: 'Link Bible Verses',
            editorCallback: (editor: Editor) => this.linkBibleReference(editor)
        });

        // Add a toolbar icon for linking Bible verses
        this.addRibbonIcon('book', 'Link Bible Reference', () => {
            const view = this.app.workspace.getActiveViewOfType(MarkdownView);
            if (view) {
                this.linkBibleReference(view.editor);
            }
        });
    }

    linkBibleReference(editor: Editor) {
        const selected = editor.getSelection().trim();

		if (!selected.match(/^[1-3]?\s?[A-Za-z]+\s\d+:\d+(-\d+)?$/)) {
			new Notice("Please select a valid Bible reference (e.g. John 3:16)");
			return;
		}

		const formatted = selected
			.replace(/\s+/g, "") // remove whitespace
			.replace(":", "."); // Bible.com uses dot instead of colon

		const url = `https://www.bible.com/bible/1/${formatted}`;
		editor.replaceSelection(`[${selected}](${url})`);
	}
}