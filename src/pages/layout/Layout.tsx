import { Outlet, NavLink, Link } from "react-router-dom";
import github from "../../assets/github.svg";
import { Checkbox, Panel, DefaultButton, TextField, SpinButton, FontSizes } from "@fluentui/react";

import { useRef, useState, useEffect } from "react";
import styles from "./Layout.module.css";
import { SettingsButton } from "../../components/SettingsButton";
// import { ClearChatButton } from "../../components/ClearChatButton";
import { chatApi, Approaches, AskResponse, ChatRequest, ChatTurn } from "../../api";
import { AnalysisPanel, AnalysisPanelTabs } from "../../components/AnalysisPanel";
const Layout = () => {
    const [displayBottomElement, setDisplayBottomElement] = useState(false);
    const [question, setQuestion] = useState<string>("");
    const lastQuestionRef = useRef<string>("");
    const [error, setError] = useState<unknown>();
    const [activeCitation, setActiveCitation] = useState<string>();
    const [activeAnalysisPanelTab, setActiveAnalysisPanelTab] = useState<AnalysisPanelTabs | undefined>(undefined);
    const [answers, setAnswers] = useState<[user: string, response: AskResponse][]>([]);
    const [selectedAnswer, setSelectedAnswer] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const clearChat = () => {
        lastQuestionRef.current = "";
        error && setError(undefined);
        setActiveCitation(undefined);
        setActiveAnalysisPanelTab(undefined);
        setAnswers([]);
    };

    const [isConfigPanelOpen, setIsConfigPanelOpen] = useState(false);
    const [promptTemplate, setPromptTemplate] = useState<string>("");
    const onPromptTemplateChange = (_ev?: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setPromptTemplate(newValue || "");
    };
    const onRetrieveCountChange = (_ev?: React.SyntheticEvent<HTMLElement, Event>, newValue?: string) => {
        setRetrieveCount(parseInt(newValue || "3"));
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
    const [retrieveCount, setRetrieveCount] = useState<number>(3);
    const [useSemanticRanker, setUseSemanticRanker] = useState<boolean>(true);
    const [useSemanticCaptions, setUseSemanticCaptions] = useState<boolean>(false);
    const [excludeCategory, setExcludeCategory] = useState<string>("");
    const [useSuggestFollowupQuestions, setUseSuggestFollowupQuestions] = useState<boolean>(false);
    return (
        <div className={styles.layout}>
            <header className={styles.header} role={"banner"}>
                <div className={styles.headerContainer}>
                    <Link to="/" className={styles.headerTitleContainer}>
                        <h4 className={styles.headerTitle}>
                            <div className={styles.svg}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    // xmlns:xlink="http://www.w3.org/1999/xlink"
                                    fill="none"
                                    version="1.1"
                                    width="42"
                                    height="16"
                                    viewBox="0 0 42 16"
                                >
                                    <g>
                                        <g>
                                            <path
                                                d="M38.6312,9.28736C36.7379,9.28736,35.5021,7.66495,35.5021,5.25266C35.5021,2.83938,36.4385,1.48091,38.2527,1.17628C38.2527,1.17628,38.2332,4.09663,38.2332,4.09663C38.8506,4.46179,39.3491,4.62354,39.947,4.62354C41.1233,4.62354,41.9007,3.87336,41.9007,2.79869C41.9007,1.13559,40.2259,0.000396729,37.7738,0.000396729C34.0868,0.000396729,31.5752,2.33231,31.5752,5.79942C31.5752,7.3613,32.0931,8.76045,33.129,9.81428C34.1463,10.8492,35.3821,11.3355,37.1564,11.3355C38.7911,11.3355,39.9665,11.0517,42.0002,10.0981C42.0002,10.0981,42.0002,8.15118,42.0002,8.15118C40.3254,8.98273,39.508,9.28736,38.6312,9.28736ZM29.6211,0C28.9637,0,28.3657,0.304637,28.0868,0.648966C28.0868,0.648966,28.0868,4.90694,28.0868,4.90694C28.0868,4.90694,25.4152,8.53778,25.4152,8.53778C25.4152,8.53778,25.4152,0.283799,25.4152,0.283799C25.4152,0.283799,22.8636,0.283799,22.8636,0.283799C22.8636,0.283799,18.6382,7.40159,18.6382,7.40159C18.6382,7.40159,18.6382,0.283799,18.6382,0.283799C18.6382,0.283799,17.1829,0.283799,17.1829,0.283799C17.1829,0.283799,13.3555,1.23641,13.3555,1.23641C13.3555,1.23641,13.3555,2.2307,13.3555,2.2307C13.3555,2.2307,15.4496,2.45397,15.4496,2.45397C15.4496,2.45397,15.4496,11.1932,15.4496,11.1932C15.4496,11.1932,18.1602,11.1932,18.1602,11.1932C18.1602,11.1932,22.2062,4.42071,22.2062,4.42071C22.2062,4.42071,22.2062,11.1932,22.2062,11.1932C22.2062,11.1932,25.1762,11.1932,25.1762,11.1932C25.1762,11.1932,29.2826,5.80001,29.2826,5.80001C30.9174,3.71121,31.4948,2.85982,31.4948,1.84469C31.4948,0.83155,30.6979,0,29.6211,0ZM5.3032,1.48061C7.27641,0.283896,7.95333,0.081466,8.95018,0.081466C11.2833,0.081466,12.9971,2.27148,12.9971,5.29304C12.9971,8.80084,10.7049,11.1536,7.07645,11.1536C6.67849,11.1536,5.98012,11.1337,5.28271,11.0524L5.3032,14.58L7.05695,14.9859L7.05695,16L0.180447,16L0.180447,14.9859L1.75473,14.58L1.75473,2.3717L0,2.3717L0,1.31788L4.20686,0.0199432L5.3032,0.0199432L5.3032,1.48061ZM5.30322,9.81398C5.58218,9.83482,5.72069,9.83482,5.90114,9.83482C8.07431,9.83482,9.24965,8.45552,9.24965,5.80011C9.24965,3.56941,8.29279,2.3717,6.53807,2.3717C6.2396,2.3717,5.94113,2.41338,5.32273,2.49475L5.30322,9.81398Z"
                                                fill-rule="evenodd"
                                                fill="#252525"
                                                fill-opacity="1"
                                            />
                                        </g>
                                    </g>
                                </svg>
                            </div>
                            &nbsp;
                            <span style={{ color: "#252525", fontWeight: 400, fontSize: 16 }}> Tax Demo ChatBot v.1.0</span>
                        </h4>
                    </Link>
                    <nav>
                        <ul className={styles.headerNavList}>
                            {/* <li>
                                <NavLink to="/" className={({ isActive }) => (isActive ? styles.headerNavPageLinkActive : styles.headerNavPageLink)}>
                                    Chat
                                </NavLink>
                            </li> */}
                            <li className={styles.headerNavLeftMargin}>
                                <div className={styles.commandsContainer}>
                                    {/* <ClearChatButton className={styles.commandButton} onClick={clearChat} disabled={!lastQuestionRef.current || isLoading} /> */}
                                    <SettingsButton className={styles.commandButton} onClick={() => setIsConfigPanelOpen(!isConfigPanelOpen)} />
                                </div>
                            </li>
                            {/* <li className={styles.headerNavLeftMargin}>
                                <a href="https://aka.ms/entgptsearch" target={"_blank"} title="Github repository link">
                                    <img
                                        src={github}
                                        alt="Github logo"
                                        aria-label="Link to github repository"
                                        width="20px"
                                        height="20px"
                                        className={styles.githubLogo}
                                    />
                                </a>
                            </li> */}
                        </ul>
                    </nav>
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
                        &nbsp;&nbsp;
                        <Checkbox
                            className={styles.chatSettingsSeparator}
                            checked={useSemanticRanker}
                            label="Use semantic ranker for retrieval"
                            onChange={onUseSemanticRankerChange}
                        />
                        &nbsp;&nbsp;&nbsp;&nbsp;
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
                    {/* <h4 className={styles.headerRightText}>Azure OpenAI + Cognitive Search</h4> */}
                </div>
            </header>

            <Outlet />
            <div className={styles.foot}>
                @2023 PwC. ALL rights reserved. PwC refers to the PwC network and/or one or more of its member firms,each of which is separate legar entity.
                Please see{" "}
                <span className={styles.footLine}>
                    <a href="www.pwc.com/structure">
                        <span style={{ color: "#d04a02" }}>&nbsp;www.pwc.com/structure&nbsp;</span>
                    </a>
                </span>{" "}
                for futher details.
            </div>
        </div>
    );
};

export default Layout;
