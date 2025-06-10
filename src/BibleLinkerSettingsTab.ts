import { App, PluginSettingTab, Setting } from 'obsidian';
import BibleLinkerPlugin from '../main';
import { VERSION_MAP } from './constants'; // Import the version mapping

export class BibleLinkerSettingsTab extends PluginSettingTab {
    plugin: BibleLinkerPlugin;

    constructor(app: App, plugin: BibleLinkerPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();

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

        new Setting(containerEl)
            .setName('Add Preview')
            .setDesc('Enable or disable the automatic preview of verses when linking.')
            .addToggle(toggle => {
                toggle.setValue(this.plugin.settings.addPreview ?? true);
                toggle.onChange(async (value) => {
                        this.plugin.settings.addPreview = value;
                        await this.plugin.saveSettings();
                });
            })
    }
}