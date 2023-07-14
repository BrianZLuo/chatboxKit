import { Example } from "./Example";

import styles from "./Example.module.css";

export type ExampleModel = {
    text: string;
    value: string;
};

const EXAMPLES: ExampleModel[] = [
    {
        text: "What is OECD Safe Harbour? ",
        value: "What is OECD Safe Harbour?"
    },
    {
        text: "What is a qualified CBC report?",
        value: "What is a qualified CBC report?"
    },
    {
        text: "What is OECD BEPS 2.0 Pillar Two?",
        value: "What is OECD BEPS 2.0 Pillar Two?"
    },
    {
        text: "What is GloBE income?",
        value: "What is GloBE income?"
    },
    {
        text: "Will China and Hong Kong implement Pillar Two?",
        value: "Will China and Hong Kong implement Pillar Two?"
    },
    {
        text: "Tell me about the plan for Pillar Two of Japan, South Korea, Singapore and Australia.",
        value: "Tell me about the plan for Pillar Two of Japan, South Korea, Singapore and Australia.​"
    },
    {
        text: "Tell me about China's Golden Tax 4 initiative.",
        value: "Tell me about China's Golden Tax 4 initiative."
    },
    {
        text: "Tell me about ESG and its impact on tax.",
        value: "Tell me about ESG and its impact on tax.​"
    }
];

interface Props {
    onExampleClicked: (value: string) => void;
}

export const ExampleList = ({ onExampleClicked }: Props) => {
    return (
        <div className={styles.examplesNavList}>
            {EXAMPLES.map((x, i) => (
                <Example key={i} text={x.text} value={x.value} onClick={onExampleClicked} />
            ))}
        </div>
    );
};
