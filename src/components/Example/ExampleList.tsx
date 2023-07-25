import { Example } from "./Example";
import styles from "./Example.module.css";
import { useSelector } from 'react-redux';
import { AppState } from '../../store';
import React from "react";

export type ExampleModel = {
    text: string;
    value: string;
};

interface Props {
    onExampleClicked: (value: string) => void;
}

export const ExampleList = ({ onExampleClicked }: Props) => {

    const developerMode = useSelector((state: AppState) => state.developerMode);

    const adminExample: ExampleModel[] = [
        {
            text: "年假有多少天? ",
            value: "年假有多少天?"
        },
        {
            text: "年假什么情况下会被扣除?",
            value: "年假什么情况下会被扣除?"
        },
        {
            text: "离职前可用年假天数?",
            value: "离职前可用年假天数?"
        },
        {
            text: "新入职伙伴年假如何折算?",
            value: "新入职伙伴年假如何折算?"
        },
        {
            text: "全薪病假天数?",
            value: "全薪病假天数?"
        },
        {
            text: "如何申请病假?",
            value: "如何申请病假?​"
        },
        {
            text: "全职伙伴病假期间工资发放标准?",
            value: "全职伙伴病假期间工资发放标准?"
        },
        {
            text: "丧假相关规定?",
            value: "丧假相关规定?​"
        }
    ];

    const developerExample: ExampleModel[] = [
        {
            text: "如何推荐伙伴加入星巴克? ",
            value: "如何推荐伙伴加入星巴克?"
        },
        {
            text: "推荐奖金发放规则?",
            value: "推荐奖金发放规则?"
        },
        {
            text: "推荐奖金金额?",
            value: "推荐奖金金额?"
        },
        {
            text: "推荐奖金没有收到?",
            value: "推荐奖金没有收到?"
        },
        {
            text: "全职录用条件?",
            value: "全职录用条件?"
        },
        {
            text: "非全录用条件?",
            value: "非全录用条件?​"
        },
        {
            text: "勤工助学条件?",
            value: "勤工助学条件?"
        }
    ];

    const [EXAMPLES, setEXAMPLES] = React.useState<ExampleModel[]>(developerExample);

    React.useEffect(() => {
        if (developerMode.developerMode) {
            setEXAMPLES(adminExample);
        } else {
            setEXAMPLES(developerExample);
        }
    }, [developerMode]);

    return (
        <div className={styles.examplesNavList}>
            {EXAMPLES.map((x, i) => (
                <Example key={i} text={x.text} value={x.value} onClick={onExampleClicked} />
            ))}
        </div>
    );
};
