import { useRef, useState, useEffect } from "react";
import { Checkbox, Panel, DefaultButton, TextField, SpinButton } from "@fluentui/react";

import styles from "./Chat.module.css";

import { chatApi, Approaches, AskResponse, ChatRequest, ChatTurn } from "../../api";
import { Answer, AnswerError, AnswerLoading } from "../../components/Answer";
import { QuestionInput } from "../../components/QuestionInput";
import { QuestionInput2 } from "../../components/QuestionInput2";
import { ClearChatButton } from "../../components/ClearChatButton";
import { SettingsButton } from "../../components/SettingsButton";
import { ExampleList } from "../../components/Example";
import { UserChatMessage } from "../../components/UserChatMessage";
import { AnalysisPanel, AnalysisPanelTabs } from "../../components/AnalysisPanel";
const Chat = () => {
    const [isConfigPanelOpen, setIsConfigPanelOpen] = useState(false);
    const [promptTemplate, setPromptTemplate] = useState<string>("");
    const [retrieveCount, setRetrieveCount] = useState<number>(6);
    const [useSemanticRanker, setUseSemanticRanker] = useState<boolean>(true);
    const [useSemanticCaptions, setUseSemanticCaptions] = useState<boolean>(false);
    const [excludeCategory, setExcludeCategory] = useState<string>("");
    const [useSuggestFollowupQuestions, setUseSuggestFollowupQuestions] = useState<boolean>(false);

    const lastQuestionRef = useRef<string>("");
    const chatMessageStreamEnd = useRef<HTMLDivElement | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<unknown>();

    const [activeCitation, setActiveCitation] = useState<string>();
    const [activeAnalysisPanelTab, setActiveAnalysisPanelTab] = useState<AnalysisPanelTabs | undefined>(undefined);

    const [selectedAnswer, setSelectedAnswer] = useState<number>(0);
    const [answers, setAnswers] = useState<[user: string, response: AskResponse][]>([]);

    const makeApiRequest = async (question: string) => {
        lastQuestionRef.current = question;

        error && setError(undefined);
        setIsLoading(true);
        setActiveCitation(undefined);
        setActiveAnalysisPanelTab(undefined);

        try {
            const history: ChatTurn[] = answers.map(a => ({ user: a[0], bot: a[1].answer }));
            const request: ChatRequest = {
                history: [...history, { user: question, bot: undefined }],
                approach: Approaches.ReadRetrieveRead,
                overrides: {
                    promptTemplate: promptTemplate.length === 0 ? undefined : promptTemplate,
                    excludeCategory: excludeCategory.length === 0 ? undefined : excludeCategory,
                    top: retrieveCount,
                    semanticRanker: useSemanticRanker,
                    semanticCaptions: useSemanticCaptions,
                    suggestFollowupQuestions: useSuggestFollowupQuestions
                }
            };
            const result = await chatApi(request);
            setAnswers([...answers, [question, result]]);
        } catch (e) {
            setError(e);
        } finally {
            setIsLoading(false);
        }
    };

    const clearChat = () => {
        lastQuestionRef.current = "";
        error && setError(undefined);
        setActiveCitation(undefined);
        setActiveAnalysisPanelTab(undefined);
        setAnswers([]);
        // 重新加载页面
        window.location.reload();
    };

    useEffect(() => chatMessageStreamEnd.current?.scrollIntoView({ behavior: "smooth" }), [isLoading]);

    const onPromptTemplateChange = (_ev?: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setPromptTemplate(newValue || "");
    };

    const onRetrieveCountChange = (_ev?: React.SyntheticEvent<HTMLElement, Event>, newValue?: string) => {
        setRetrieveCount(parseInt(newValue || "6"));
    };

    const onUseSemanticRankerChange = (_ev?: React.FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean) => {
        setUseSemanticRanker(!!checked);
    };

    const onUseSemanticCaptionsChange = (_ev?: React.FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean) => {
        setUseSemanticCaptions(!!checked);
    };

    const onExcludeCategoryChanged = (_ev?: React.FormEvent, newValue?: string) => {
        setExcludeCategory(newValue || "");
    };

    const onUseSuggestFollowupQuestionsChange = (_ev?: React.FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean) => {
        setUseSuggestFollowupQuestions(!!checked);
    };

    const onExampleClicked = (example: string) => {
        makeApiRequest(example);
    };

    const onShowCitation = (citation: string, index: number) => {
        if (activeCitation === citation && activeAnalysisPanelTab === AnalysisPanelTabs.CitationTab && selectedAnswer === index) {
            setActiveAnalysisPanelTab(undefined);
        } else {
            setActiveCitation(citation);
            setActiveAnalysisPanelTab(AnalysisPanelTabs.CitationTab);
        }

        setSelectedAnswer(index);
    };

    const onToggleTab = (tab: AnalysisPanelTabs, index: number) => {
        if (activeAnalysisPanelTab === tab && selectedAnswer === index) {
            setActiveAnalysisPanelTab(undefined);
        } else {
            setActiveAnalysisPanelTab(tab);
        }

        setSelectedAnswer(index);
    };

    return (
        <div className={styles.container}>
            <div className={styles.commandsContainer}>
                {/*  <ClearChatButton className={styles.commandButton} onClick={clearChat} disabled={!lastQuestionRef.current || isLoading} /> */}
                {/* <SettingsButton className={styles.commandButton} onClick={() => setIsConfigPanelOpen(!isConfigPanelOpen)} /> */}
            </div>
            <div className={styles.chatRoot}>
                <div className={styles.chatContainer}>
                    {!lastQuestionRef.current ? (
                        <div className={styles.chatEmptyState}>
                            {/* <SparkleFilled fontSize={"120px"} primaryFill={"rgba(115, 118, 225, 1)"} aria-hidden="true" aria-label="Chat logo" /> */}
                            {/* <h1 className={styles.chatEmptyStateTitle}>Chat with your data</h1>
                            <h2 className={styles.chatEmptyStateSubtitle}>Ask anything or try an example</h2> */}
                            <div className={styles.imgContainer}>
                                <div className={styles.leftWordContainer}>
                                    <div className={styles.data}>请咨询您的星巴克助手</div>
                                    <div className={styles.ask}>可以询问任何关于假期的问题</div>
                                </div>
                                <div className={styles.rightContainer}>
                                    <div className={styles.imgCon}>
                                        {/*<img src="/halfBack.png" alt="示例图片" width="100%" height="100%" />*/}
                                    </div>
                                </div>
                            </div>

                            <div className={styles.chatInput}>
                                <QuestionInput
                                    clearOnSend
                                    placeholder="Enter your question here (e.g., what is OECD’s Safe Harbour Rule?)"
                                    disabled={isLoading}
                                    onSend={question => makeApiRequest(question)}
                                />
                            </div>

                            <div className={styles.exampleListContainer}>
                                <ExampleList onExampleClicked={onExampleClicked} />
                            </div>
                            {/**语音识别话筒框  */}
                            <section className={styles.fixedBox} id="fixed-box">
                                <div className={styles.fixedMain}>
                                    <button className={styles.fixedClose} id="close-btn"></button>
                                    <div /* id="fixed-txt" */></div>
                                    <div className={styles.fixedIcon}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            // xmlns:xlink="http://www.w3.org/1999/xlink"
                                            fill="none"
                                            version="1.1"
                                            width="104"
                                            height="104"
                                            viewBox="0 0 104 104"
                                        >
                                            <g>
                                                <g>
                                                    <ellipse cx="52" cy="52" rx="50" ry="50" fill="#D04A02" fill-opacity="1" />
                                                </g>
                                                <g>
                                                    <ellipse cx="52" cy="52" rx="52" ry="52" fill="#D04A02" fill-opacity="0" />
                                                    <ellipse
                                                        cx="52"
                                                        cy="52"
                                                        rx="51.5"
                                                        ry="51.5"
                                                        fill-opacity="0"
                                                        stroke-opacity="0"
                                                        stroke="#FFD7C1"
                                                        fill="none"
                                                        stroke-width="1"
                                                    />
                                                </g>
                                                <g>
                                                    <g>
                                                        <path
                                                            d="M54.16011328125,68.512C54.16011328125,68.512,54.16011328125,72.976,54.16011328125,72.976C54.16011328125,72.976,60.73611328125,72.976,60.73611328125,72.976C60.73611328125,72.976,60.73611328125,76,60.73611328125,76C60.73611328125,76,44.60811328125,76,44.60811328125,76C44.60811328125,76,44.60811328125,72.976,44.60811328125,72.976C44.60811328125,72.976,51.18411328125,72.976,51.18411328125,72.976C51.18411328125,72.976,51.18411328125,68.512,51.18411328125,68.512C48.33611328125,68.256,45.74411328125,67.328,43.40811328125,65.72800000000001C41.10411328125,64.19200000000001,39.29611328125,62.208,37.98411328125,59.775999999999996C36.67211328125,57.28,36.01611328125,54.608000000000004,36.01611328125,51.760000000000005C36.01611328125,51.760000000000005,39.04011328125,51.760000000000005,39.04011328125,51.760000000000005C39.04011328125,54.256,39.66411328125,56.56,40.91211328125,58.672C42.09611328125,60.752,43.72811328125,62.4,45.80811328125,63.616C47.920113281249996,64.832,50.20811328125,65.44,52.67211328125,65.44C55.16811328125,65.44,57.47211328125,64.816,59.58411328125,63.568C61.664113281249996,62.384,63.29611328125,60.752,64.48011328125,58.672C65.72811328125,56.56,66.35211328125,54.256,66.35211328125,51.760000000000005C66.35211328125,51.760000000000005,69.32811328125,51.760000000000005,69.32811328125,51.760000000000005C69.32811328125,54.608000000000004,68.67211328125,57.28,67.36011328125,59.775999999999996C66.04811328125,62.208,64.22411328125,64.208,61.88811328125,65.77600000000001C59.58411328125,67.312,57.008113281250004,68.22399999999999,54.16011328125,68.512ZM62.03211328125,36.784C61.93611328125,35.152,61.45611328125,33.664,60.59211328125,32.32C59.72811328125,30.976,58.59211328125,29.92,57.18411328125,29.152C55.80811328125,28.384,54.30411328125,28,52.67211328125,28C51.04011328125,28,49.52011328125,28.384,48.112113281250004,29.152C46.73611328125,29.92,45.61611328125,30.976,44.752113281250004,32.32C43.88811328125,33.664,43.40811328125,35.152,43.31211328125,36.784C43.31211328125,36.784,43.31211328125,37.792,43.31211328125,37.792C43.31211328125,37.792,62.03211328125,37.792,62.03211328125,37.792C62.03211328125,37.792,62.03211328125,36.784,62.03211328125,36.784ZM52.67211328125,62.032C53.920113281249996,62.032,55.12011328125,61.792,56.27211328125,61.312C57.42411328125,60.832,58.43211328125,60.144,59.29611328125,59.248000000000005C60.19211328125,58.352000000000004,60.880113281250004,57.328,61.36011328125,56.176C61.84011328125,55.024,62.08011328125,53.824,62.08011328125,52.576C62.08011328125,52.576,62.08011328125,40.864000000000004,62.08011328125,40.864000000000004C62.08011328125,40.864000000000004,43.26411328125,40.864000000000004,43.26411328125,40.864000000000004C43.26411328125,40.864000000000004,43.26411328125,52.623999999999995,43.26411328125,52.623999999999995C43.26411328125,54.32,43.68011328125,55.888000000000005,44.51211328125,57.328C45.37611328125,58.768,46.52811328125,59.92,47.96811328125,60.784C49.408113281249996,61.616,50.97611328125,62.032,52.67211328125,62.032Z"
                                                            fill="#FFFFFF"
                                                            fill-opacity="1"
                                                        />
                                                    </g>
                                                </g>
                                            </g>
                                        </svg>
                                    </div>
                                </div>
                            </section>
                        </div>
                    ) : (
                        // change
                        <div>
                            <div className={styles.chatMessageStream}>
                                {answers.map((answer, index) => (
                                    <div key={index}>
                                        <UserChatMessage message={answer[0]} />
                                        <div className={styles.chatMessageGpt}>
                                            <div>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    // xmlns:xlink="http://www.w3.org/1999/xlink"
                                                    fill="none"
                                                    version="1.1"
                                                    width="48"
                                                    height="48"
                                                    viewBox="0 0 48 48"
                                                >
                                                    <g>
                                                        <g>
                                                            <ellipse cx="24" cy="24" rx="24" ry="24" fill="#202322" fill-opacity="1" />
                                                        </g>
                                                        <g>
                                                            <path
                                                                d="M31.175,21.228030176391602L31.175,27.1074901763916L32,27.1074901763916L32,29.281590176391603L30.8733,29.281590176391603L30.8733,28.5720901763916L29.868299999999998,28.5720901763916L29.868299999999998,29.281590176391603L28.741300000000003,29.281590176391603L28.741300000000003,27.1074901763916L29.524900000000002,27.1074901763916L29.524900000000002,22.359200176391603L28.271,22.359200176391603L28.271,28.4640901763916L27.0903,28.4640901763916L27.0903,32.808590176391604L28.271,32.808590176391604L28.271,34.5262901763916L24.25937,34.5262901763916L24.25937,32.808590176391604L25.44019,32.808590176391604L25.44019,28.4640901763916L22.584229999999998,28.4640901763916L22.584229999999998,32.808590176391604L23.76489,32.808590176391604L23.76489,34.5262901763916L19.75344,34.5262901763916L19.75344,32.808590176391604L20.9341,32.808590176391604L20.9341,28.4640901763916L19.76926,28.4640901763916L19.76926,22.359200176391603L18.47526,22.359200176391603L18.47526,27.1074901763916L19.25866,27.1074901763916L19.25866,29.281590176391603L18.13195,29.281590176391603L18.13195,28.5720901763916L17.12701,28.5720901763916L17.12701,29.281590176391603L16,29.281590176391603L16,27.1074901763916L16.825138,27.1074901763916L16.825138,21.228030176391602L19.76926,21.228030176391602L19.76926,20.598240176391602L22.47918,20.598240176391602L22.47918,19.8954001763916L19.76926,19.8954001763916L19.76926,17.6915801763916L18.76583,17.6915801763916L18.76583,18.213740176391603L17.00041,18.213740176391603L17.00041,16.782640176391602L18.76583,16.782640176391602L18.76583,17.2333201763916L19.76926,17.2333201763916L19.76926,14.315790176391602L28.271,14.315790176391602L28.271,17.2333201763916L29.2815,17.2333201763916L29.2815,16.782640176391602L31.0469,16.782640176391602L31.0469,18.213740176391603L29.2815,18.213740176391603L29.2815,17.6915801763916L28.271,17.6915801763916L28.271,19.8954001763916L25.5612,19.8954001763916L25.5612,20.598240176391602L28.271,20.598240176391602L28.271,21.228030176391602L31.175,21.228030176391602ZM22.95634,17.582940176391602L21.19092,17.582940176391602L21.19092,16.1518501763916L22.95634,16.1518501763916L22.95634,17.582940176391602ZM25.05469,17.582940176391602L26.8201,17.582940176391602L26.8201,16.1518501763916L25.05469,16.1518501763916L25.05469,17.582940176391602ZM25.65444,18.9234401763916L22.35645,18.9234401763916L22.35645,18.3471601763916L25.65444,18.3471601763916L25.65444,18.9234401763916Z"
                                                                fill-rule="evenodd"
                                                                fill="#E5E5E5"
                                                                fill-opacity="1"
                                                            />
                                                        </g>
                                                    </g>
                                                </svg>
                                            </div>

                                            <Answer
                                                key={index}
                                                answer={answer[1]}
                                                isSelected={selectedAnswer === index && activeAnalysisPanelTab !== undefined}
                                                onCitationClicked={c => onShowCitation(c, index)}
                                                onThoughtProcessClicked={() => onToggleTab(AnalysisPanelTabs.ThoughtProcessTab, index)}
                                                onSupportingContentClicked={() => onToggleTab(AnalysisPanelTabs.SupportingContentTab, index)}
                                                onFollowupQuestionClicked={q => makeApiRequest(q)}
                                                showFollowupQuestions={useSuggestFollowupQuestions && answers.length - 1 === index}
                                            />
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <>
                                        <UserChatMessage message={lastQuestionRef.current} />
                                        <div className={styles.chatMessageGptMinWidth}>
                                            <AnswerLoading />
                                        </div>
                                    </>
                                )}
                                {error ? (
                                    <>
                                        <UserChatMessage message={lastQuestionRef.current} />
                                        <div className={styles.chatMessageGptMinWidth}>
                                            <div>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    // xmlns:xlink="http://www.w3.org/1999/xlink"
                                                    fill="none"
                                                    version="1.1"
                                                    width="48"
                                                    height="48"
                                                    viewBox="0 0 48 48"
                                                >
                                                    <g>
                                                        <g>
                                                            <ellipse cx="24" cy="24" rx="24" ry="24" fill="#202322" fill-opacity="1" />
                                                        </g>
                                                        <g>
                                                            <path
                                                                d="M31.175,21.228030176391602L31.175,27.1074901763916L32,27.1074901763916L32,29.281590176391603L30.8733,29.281590176391603L30.8733,28.5720901763916L29.868299999999998,28.5720901763916L29.868299999999998,29.281590176391603L28.741300000000003,29.281590176391603L28.741300000000003,27.1074901763916L29.524900000000002,27.1074901763916L29.524900000000002,22.359200176391603L28.271,22.359200176391603L28.271,28.4640901763916L27.0903,28.4640901763916L27.0903,32.808590176391604L28.271,32.808590176391604L28.271,34.5262901763916L24.25937,34.5262901763916L24.25937,32.808590176391604L25.44019,32.808590176391604L25.44019,28.4640901763916L22.584229999999998,28.4640901763916L22.584229999999998,32.808590176391604L23.76489,32.808590176391604L23.76489,34.5262901763916L19.75344,34.5262901763916L19.75344,32.808590176391604L20.9341,32.808590176391604L20.9341,28.4640901763916L19.76926,28.4640901763916L19.76926,22.359200176391603L18.47526,22.359200176391603L18.47526,27.1074901763916L19.25866,27.1074901763916L19.25866,29.281590176391603L18.13195,29.281590176391603L18.13195,28.5720901763916L17.12701,28.5720901763916L17.12701,29.281590176391603L16,29.281590176391603L16,27.1074901763916L16.825138,27.1074901763916L16.825138,21.228030176391602L19.76926,21.228030176391602L19.76926,20.598240176391602L22.47918,20.598240176391602L22.47918,19.8954001763916L19.76926,19.8954001763916L19.76926,17.6915801763916L18.76583,17.6915801763916L18.76583,18.213740176391603L17.00041,18.213740176391603L17.00041,16.782640176391602L18.76583,16.782640176391602L18.76583,17.2333201763916L19.76926,17.2333201763916L19.76926,14.315790176391602L28.271,14.315790176391602L28.271,17.2333201763916L29.2815,17.2333201763916L29.2815,16.782640176391602L31.0469,16.782640176391602L31.0469,18.213740176391603L29.2815,18.213740176391603L29.2815,17.6915801763916L28.271,17.6915801763916L28.271,19.8954001763916L25.5612,19.8954001763916L25.5612,20.598240176391602L28.271,20.598240176391602L28.271,21.228030176391602L31.175,21.228030176391602ZM22.95634,17.582940176391602L21.19092,17.582940176391602L21.19092,16.1518501763916L22.95634,16.1518501763916L22.95634,17.582940176391602ZM25.05469,17.582940176391602L26.8201,17.582940176391602L26.8201,16.1518501763916L25.05469,16.1518501763916L25.05469,17.582940176391602ZM25.65444,18.9234401763916L22.35645,18.9234401763916L22.35645,18.3471601763916L25.65444,18.3471601763916L25.65444,18.9234401763916Z"
                                                                fill-rule="evenodd"
                                                                fill="#E5E5E5"
                                                                fill-opacity="1"
                                                            />
                                                        </g>
                                                    </g>
                                                </svg>
                                            </div>
                                            <AnswerError error={error.toString()} onRetry={() => makeApiRequest(lastQuestionRef.current)} />
                                        </div>
                                    </>
                                ) : null}

                                <div ref={chatMessageStreamEnd} />
                            </div>
                            <div className={styles.chatInput1}>
                                <QuestionInput2
                                    clearOnSend
                                    placeholder="Enter your question here (e.g., what is OECD’s Safe Harbour Rule?)​"
                                    disabled={isLoading}
                                    onSend={question => makeApiRequest(question)}
                                    clearChat={clearChat}
                                />
                            </div>
                            {/**语音识别话筒框  */}
                            {/* <section className={styles.fixedBox} id="fixed-box">
                                <div className={styles.fixedMain}>
                                    <button className={styles.fixedClose} id="close-btn"></button>
                                    <div id="fixed-txt"></div>
                                    <div className={styles.fixedIcon}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            // xmlns:xlink="http://www.w3.org/1999/xlink"
                                            fill="none"
                                            version="1.1"
                                            width="104"
                                            height="104"
                                            viewBox="0 0 104 104"
                                        >
                                            <g>
                                                <g>
                                                    <ellipse cx="52" cy="52" rx="50" ry="50" fill="#D04A02" fill-opacity="1" />
                                                </g>
                                                <g>
                                                    <ellipse cx="52" cy="52" rx="52" ry="52" fill="#D04A02" fill-opacity="0" />
                                                    <ellipse
                                                        cx="52"
                                                        cy="52"
                                                        rx="51.5"
                                                        ry="51.5"
                                                        fill-opacity="0"
                                                        stroke-opacity="0"
                                                        stroke="#FFD7C1"
                                                        fill="none"
                                                        stroke-width="1"
                                                    />
                                                </g>
                                                <g>
                                                    <g>
                                                        <path
                                                            d="M54.16011328125,68.512C54.16011328125,68.512,54.16011328125,72.976,54.16011328125,72.976C54.16011328125,72.976,60.73611328125,72.976,60.73611328125,72.976C60.73611328125,72.976,60.73611328125,76,60.73611328125,76C60.73611328125,76,44.60811328125,76,44.60811328125,76C44.60811328125,76,44.60811328125,72.976,44.60811328125,72.976C44.60811328125,72.976,51.18411328125,72.976,51.18411328125,72.976C51.18411328125,72.976,51.18411328125,68.512,51.18411328125,68.512C48.33611328125,68.256,45.74411328125,67.328,43.40811328125,65.72800000000001C41.10411328125,64.19200000000001,39.29611328125,62.208,37.98411328125,59.775999999999996C36.67211328125,57.28,36.01611328125,54.608000000000004,36.01611328125,51.760000000000005C36.01611328125,51.760000000000005,39.04011328125,51.760000000000005,39.04011328125,51.760000000000005C39.04011328125,54.256,39.66411328125,56.56,40.91211328125,58.672C42.09611328125,60.752,43.72811328125,62.4,45.80811328125,63.616C47.920113281249996,64.832,50.20811328125,65.44,52.67211328125,65.44C55.16811328125,65.44,57.47211328125,64.816,59.58411328125,63.568C61.664113281249996,62.384,63.29611328125,60.752,64.48011328125,58.672C65.72811328125,56.56,66.35211328125,54.256,66.35211328125,51.760000000000005C66.35211328125,51.760000000000005,69.32811328125,51.760000000000005,69.32811328125,51.760000000000005C69.32811328125,54.608000000000004,68.67211328125,57.28,67.36011328125,59.775999999999996C66.04811328125,62.208,64.22411328125,64.208,61.88811328125,65.77600000000001C59.58411328125,67.312,57.008113281250004,68.22399999999999,54.16011328125,68.512ZM62.03211328125,36.784C61.93611328125,35.152,61.45611328125,33.664,60.59211328125,32.32C59.72811328125,30.976,58.59211328125,29.92,57.18411328125,29.152C55.80811328125,28.384,54.30411328125,28,52.67211328125,28C51.04011328125,28,49.52011328125,28.384,48.112113281250004,29.152C46.73611328125,29.92,45.61611328125,30.976,44.752113281250004,32.32C43.88811328125,33.664,43.40811328125,35.152,43.31211328125,36.784C43.31211328125,36.784,43.31211328125,37.792,43.31211328125,37.792C43.31211328125,37.792,62.03211328125,37.792,62.03211328125,37.792C62.03211328125,37.792,62.03211328125,36.784,62.03211328125,36.784ZM52.67211328125,62.032C53.920113281249996,62.032,55.12011328125,61.792,56.27211328125,61.312C57.42411328125,60.832,58.43211328125,60.144,59.29611328125,59.248000000000005C60.19211328125,58.352000000000004,60.880113281250004,57.328,61.36011328125,56.176C61.84011328125,55.024,62.08011328125,53.824,62.08011328125,52.576C62.08011328125,52.576,62.08011328125,40.864000000000004,62.08011328125,40.864000000000004C62.08011328125,40.864000000000004,43.26411328125,40.864000000000004,43.26411328125,40.864000000000004C43.26411328125,40.864000000000004,43.26411328125,52.623999999999995,43.26411328125,52.623999999999995C43.26411328125,54.32,43.68011328125,55.888000000000005,44.51211328125,57.328C45.37611328125,58.768,46.52811328125,59.92,47.96811328125,60.784C49.408113281249996,61.616,50.97611328125,62.032,52.67211328125,62.032Z"
                                                            fill="#FFFFFF"
                                                            fill-opacity="1"
                                                        />
                                                    </g>
                                                </g>
                                            </g>
                                        </svg>
                                    </div>
                                </div>
                            </section> */}
                        </div>
                    )}
                </div>

                {answers.length > 0 && activeAnalysisPanelTab && (
                    <AnalysisPanel
                        className={styles.chatAnalysisPanel}
                        activeCitation={activeCitation}
                        onActiveTabChanged={x => onToggleTab(x, selectedAnswer)}
                        citationHeight="810px"
                        answer={answers[selectedAnswer][1]}
                        activeTab={activeAnalysisPanelTab}
                    />
                )}

                <Panel
                    headerText="Configure answer generation"
                    isOpen={isConfigPanelOpen}
                    isBlocking={false}
                    onDismiss={() => setIsConfigPanelOpen(false)}
                    closeButtonAriaLabel="Close"
                    onRenderFooterContent={() => <DefaultButton onClick={() => setIsConfigPanelOpen(false)}>Close</DefaultButton>}
                    isFooterAtBottom={true}
                >
                    <TextField
                        className={styles.chatSettingsSeparator}
                        defaultValue={promptTemplate}
                        label="Override prompt template"
                        multiline
                        autoAdjustHeight
                        onChange={onPromptTemplateChange}
                    />

                    <SpinButton
                        className={styles.chatSettingsSeparator}
                        label="Retrieve this many documents from search:"
                        min={1}
                        max={50}
                        defaultValue={retrieveCount.toString()}
                        onChange={onRetrieveCountChange}
                    />
                    <TextField className={styles.chatSettingsSeparator} label="Exclude category" onChange={onExcludeCategoryChanged} />
                    <Checkbox
                        className={styles.chatSettingsSeparator}
                        checked={useSemanticRanker}
                        label="Use semantic ranker for retrieval"
                        onChange={onUseSemanticRankerChange}
                    />
                    <Checkbox
                        className={styles.chatSettingsSeparator}
                        checked={useSemanticCaptions}
                        label="Use query-contextual summaries instead of whole documents"
                        onChange={onUseSemanticCaptionsChange}
                        disabled={!useSemanticRanker}
                    />
                    <Checkbox
                        className={styles.chatSettingsSeparator}
                        checked={useSuggestFollowupQuestions}
                        label="Suggest follow-up questions"
                        onChange={onUseSuggestFollowupQuestionsChange}
                    />
                </Panel>
            </div>
        </div>
    );
};

export default Chat;
