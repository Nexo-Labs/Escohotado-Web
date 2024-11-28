import { Meta, StoryObj } from "@storybook/react";
import { ArticlePage } from "./article_main";

const meta: Meta = {
    title:"Articles/Pages/Main",
    component: ArticlePage,
    parameters: {
        design: {
            type: "figspec",
            url: "https://www.figma.com/files/xq1hrsTcwvQMgX49pwXGcc/Escohotado?node-id=290-796&t=3gc5bSOiadLfboYX-4",
        },
    },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
    parameters: {
        layout: "fullscreen",
    }
};

export const Mobile: Story = {
    parameters: {
        viewport: {
            defaultViewport: 'iphonex',
        },
    }
};