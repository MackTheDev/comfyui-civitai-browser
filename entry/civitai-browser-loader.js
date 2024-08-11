import {app} from "../../scripts/app.js";
import {api} from "../../scripts/api.js";

app.registerExtension({
    name: 'civitai-browser',
    async setup() {
        try {
            await import(api.api_base + "/civitai-browser/main.js");
        } catch (_) {
        }

        try {
            // new style Manager buttons
            let buttonGroup = new (await import("../../scripts/ui/components/buttonGroup.js")).ComfyButtonGroup(
                new (await import("../../scripts/ui/components/button.js")).ComfyButton({
                    icon: "compass-outline",
                    action: () => {
                        const event = new CustomEvent('civitai-browser-open');
                        window.dispatchEvent(event);
                    },
                    tooltip: "Explore Models",
                    content: "CivitAI Browser",
                    classList: "comfyui-button comfyui-menu-mobile-collapse"
                }).element);

            app.menu?.settingsGroup.element.before(buttonGroup.element);
        } catch (exception) {
            console.log('ComfyUI is outdated. New style menu based features are disabled.');
        }
    }
});