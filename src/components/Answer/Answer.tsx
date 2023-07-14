import { useMemo } from "react";
import { Stack, IconButton } from "@fluentui/react";
import DOMPurify from "dompurify";
import React, { useState } from "react";
import styles from "./Answer.module.css";

import { AskResponse, getCitationFilePath } from "../../api";
import { parseAnswerToHtml } from "./AnswerParser";
import { AnswerIcon } from "./AnswerIcon";

interface Props {
    answer: AskResponse;
    isSelected?: boolean;
    onCitationClicked: (filePath: string) => void;
    onThoughtProcessClicked: () => void;
    onSupportingContentClicked: () => void;
    onFollowupQuestionClicked?: (question: string) => void;
    showFollowupQuestions?: boolean;
}

export const Answer = ({
    answer,
    isSelected,
    onCitationClicked,
    onThoughtProcessClicked,
    onSupportingContentClicked,
    onFollowupQuestionClicked,
    showFollowupQuestions
}: Props) => {
    const parsedAnswer = useMemo(() => parseAnswerToHtml(answer.answer, onCitationClicked), [answer]);
    const [iconColor, setIconColor] = useState<string>("black"); //点赞按钮
    const [iconColor2, setIconColor2] = useState<string>("black"); //点赞按钮

    const sanitizedAnswerHtml = DOMPurify.sanitize(parsedAnswer.answerHtml);
    const handleClick = () => {
        // 根据当前图标颜色设置新的颜色值
        const newColor = iconColor === "black" ? "orange" : "black";
        setIconColor(newColor);
    };
    const handleClick2 = () => {
        // 根据当前图标颜色设置新的颜色值
        const newColor = iconColor2 === "black" ? "orange" : "black";
        setIconColor2(newColor);
    };

    return (
        <Stack className={`${styles.answerContainer} ${isSelected && styles.selected}`} verticalAlign="space-between">
            <Stack.Item grow>
                <div className={styles.answerText} dangerouslySetInnerHTML={{ __html: sanitizedAnswerHtml }}></div>
            </Stack.Item>

            {!!parsedAnswer.citations.length && (
                <Stack.Item>
                    <Stack horizontal wrap tokens={{ childrenGap: 5 }}>
                        <span className={styles.citationLearnMore}>Reference:</span>
                        {parsedAnswer.citations.map((x, i) => {
                            const path = getCitationFilePath(x);
                            return (
                                <a key={i} className={styles.citation} title={x} onClick={() => onCitationClicked(path)}>
                                    {`${++i}. ${x}`}
                                </a>
                            );
                        })}
                    </Stack>
                </Stack.Item>
            )}

            {!!parsedAnswer.followupQuestions.length && showFollowupQuestions && onFollowupQuestionClicked && (
                <Stack.Item>
                    <Stack horizontal wrap className={`${!!parsedAnswer.citations.length ? styles.followupQuestionsList : ""}`} tokens={{ childrenGap: 6 }}>
                        <span className={styles.followupQuestionLearnMore}>Follow-up questions:</span>
                        {parsedAnswer.followupQuestions.map((x, i) => {
                            return (
                                <a key={i} className={styles.followupQuestion} title={x} onClick={() => onFollowupQuestionClicked(x)}>
                                    {`${x}`}
                                </a>
                            );
                        })}
                    </Stack>
                </Stack.Item>
            )}

            <Stack.Item>
                <Stack horizontal horizontalAlign="space-between">
                    <AnswerIcon />
                    <div className={styles.btnContainer}>
                        {/* <IconButton
                            style={{ color: "black" }}
                            iconProps={{ iconName: "Lightbulb" }}
                            title="Show thought process"
                            ariaLabel="Show thought process"
                            onClick={() => onThoughtProcessClicked()}
                            disabled={!answer.thoughts}
                        />
                        <IconButton
                            style={{ color: "black" }}
                            iconProps={{ iconName: "ClipboardList" }}
                            title="Show supporting content"
                            ariaLabel="Show supporting content"
                            onClick={() => onSupportingContentClicked()}
                            disabled={!answer.data_points.length}
                        />
                        <IconButton
                            style={{ color: iconColor }}
                            iconProps={{ iconName: "Like" }}
                            title="Like"
                            ariaLabel="Like"
                            onClick={() => handleClick()}
                            // disabled={!answer.data_points.length}
                        />
                        <IconButton
                            style={{ color: iconColor2 }}
                            iconProps={{ iconName: "Dislike" }}
                            title="Dislike"
                            ariaLabel="Dislike"
                            onClick={() => handleClick2()}
                            // disabled={!answer.data_points.length}
                        /> */}
                        <div onClick={() => onSupportingContentClicked()}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                // xmlns:xlink="http://www.w3.org/1999/xlink"
                                fill="none"
                                version="1.1"
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                            >
                                <g>
                                    <g>
                                        <path
                                            d="M10.39552,0L2,0L2,16L14.4481,16L14.4481,4.50724L10.39552,0ZM13.5127,15.0647L13.5127,5.09852L9.59332,5.09852L9.59332,0.935333L2.935333,0.935333L2.935333,15.0647L13.5127,15.0647ZM10.52865,1.32779L13.0528,4.40869L10.52865,4.40869L10.52865,1.32779ZM5,8L12,8L12,9L5,9L5,8ZM12,11L5,11L5,12L12,12L12,11Z"
                                            fill-rule="evenodd"
                                            fill="#D04A02"
                                            fill-opacity="1"
                                        />
                                    </g>
                                    <g>
                                        <path
                                            d="M10.4,-7.105427357601002e-15C10.4,-7.105427357601002e-15,14.448,4.5119999999999925,14.448,4.5119999999999925C14.448,4.5119999999999925,14.448,15.999999999999993,14.448,15.999999999999993C14.448,15.999999999999993,2,15.999999999999993,2,15.999999999999993C2,15.999999999999993,2,-7.105427357601002e-15,2,-7.105427357601002e-15C2,-7.105427357601002e-15,10.4,-7.105427357601002e-15,10.4,-7.105427357601002e-15ZM9.6,0.9279989999999929C9.6,0.9279989999999929,2.944,0.9279989999999929,2.944,0.9279989999999929C2.944,0.9279989999999929,2.944,15.071999999999992,2.944,15.071999999999992C2.944,15.071999999999992,13.52,15.071999999999992,13.52,15.071999999999992C13.52,15.071999999999992,13.52,5.103999999999993,13.52,5.103999999999993C13.52,5.103999999999993,9.6,5.103999999999993,9.6,5.103999999999993C9.6,5.103999999999993,9.6,0.9279989999999929,9.6,0.9279989999999929ZM12,10.991999999999994C12,10.991999999999994,12,11.999999999999993,12,11.999999999999993C12,11.999999999999993,5.008,11.999999999999993,5.008,11.999999999999993C5.008,11.999999999999993,5.008,10.991999999999994,5.008,10.991999999999994C5.008,10.991999999999994,12,10.991999999999994,12,10.991999999999994ZM12,7.999999999999993C12,7.999999999999993,12,8.991999999999994,12,8.991999999999994C12,8.991999999999994,5.008,8.991999999999994,5.008,8.991999999999994C5.008,8.991999999999994,5.008,7.999999999999993,5.008,7.999999999999993C5.008,7.999999999999993,12,7.999999999999993,12,7.999999999999993ZM10.528,1.327999999999993C10.528,1.327999999999993,10.528,4.399999999999993,10.528,4.399999999999993C10.528,4.399999999999993,13.056,4.399999999999993,13.056,4.399999999999993C13.056,4.399999999999993,10.528,1.327999999999993,10.528,1.327999999999993Z"
                                            fill="#202322"
                                            fill-opacity="1"
                                        />
                                    </g>
                                </g>
                            </svg>
                        </div>
                        <div onClick={() => handleClick()}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                // xmlns:xlink="http://www.w3.org/1999/xlink"
                                fill="none"
                                version="1.1"
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                            >
                                <g>
                                    <g>
                                        <path
                                            d="M0,6C0,6,1.008,6,1.008,6C1.008,6,1.008,16,1.008,16C1.008,16,0,16,0,16C0,16,0,6,0,6ZM10,6C10,6,15.008,6,15.008,6C15.2853,6,15.52,6.096,15.712,6.288C15.904,6.48,16,6.71467,16,6.992C16,6.992,16,15.008,16,15.008C16,15.2747,15.904,15.504,15.712,15.696C15.52,15.8987,15.2853,16,15.008,16C15.008,16,4,16,4,16C4,16,4,6,4,6C4,6,7.008,2.992,7.008,2.992C7.008,2.992,7.008,1.504,7.008,1.504C7.008,1.088,7.152,0.736,7.44,0.448C7.73867,0.149333,8.09067,0,8.496,0C8.912,0,9.264,0.149333,9.552,0.448C9.85067,0.736,10,1.088,10,1.504C10,1.504,10,6,10,6ZM5.008,15.008C5.008,15.008,15.008,15.008,15.008,15.008C15.008,15.008,15.008,6.992,15.008,6.992C15.008,6.992,9.008,6.992,9.008,6.992C9.008,6.992,9.008,1.504,9.008,1.504C9.008,1.35467,8.96,1.232,8.864,1.136C8.768,1.04,8.64533,0.992,8.496,0.992C8.35733,0.992,8.24,1.04533,8.144,1.152C8.048,1.248,8,1.36533,8,1.504C8,1.504,8,3.408,8,3.408C8,3.408,5.008,6.416,5.008,6.416C5.008,6.416,5.008,15.008,5.008,15.008Z"
                                            fill={iconColor} //  iconColor #202322
                                            fill-opacity="1"
                                        />
                                    </g>
                                </g>
                            </svg>
                        </div>
                        <div onClick={() => handleClick2()}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                // xmlns:xlink="http://www.w3.org/1999/xlink"
                                fill="none"
                                version="1.1"
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                            >
                                <g>
                                    <g>
                                        <path
                                            d="M0,10C0,10,1.008,10,1.008,10C1.008,10,1.008,0,1.008,0C1.008,0,0,0,0,0C0,0,0,10,0,10ZM10,10C10,10,15.008,10,15.008,10C15.2853,10,15.52,9.904,15.712,9.712C15.904,9.50933,16,9.26933,16,8.992C16,8.992,16,0.992,16,0.992C16,0.714667,15.904,0.48,15.712,0.288C15.52,0.096,15.2853,0,15.008,0C15.008,0,4,0,4,0C4,0,4,10,4,10C4,10,7.008,12.992,7.008,12.992C7.008,12.992,7.008,14.496,7.008,14.496C7.008,14.912,7.152,15.264,7.44,15.552C7.73867,15.8507,8.09067,16,8.496,16C8.912,16,9.264,15.8507,9.552,15.552C9.85067,15.264,10,14.912,10,14.496C10,14.496,10,10,10,10ZM5.008,0.992C5.008,0.992,15.008,0.992,15.008,0.992C15.008,0.992,15.008,8.992,15.008,8.992C15.008,8.992,9.008,8.992,9.008,8.992C9.008,8.992,9.008,14.496,9.008,14.496C9.008,14.6347,8.96,14.752,8.864,14.848C8.768,14.9547,8.64533,15.008,8.496,15.008C8.35733,15.008,8.24,14.9547,8.144,14.848C8.048,14.752,8,14.6347,8,14.496C8,14.496,8,12.592,8,12.592C8,12.592,5.008,9.584,5.008,9.584C5.008,9.584,5.008,0.992,5.008,0.992Z"
                                            fill={iconColor2}
                                            fill-opacity="1"
                                        />
                                    </g>
                                </g>
                            </svg>
                        </div>
                    </div>
                </Stack>
            </Stack.Item>
        </Stack>
    );
};
