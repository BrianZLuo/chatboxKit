import { useState, useEffect } from "react";
import { Stack, TextField } from "@fluentui/react";
import { Send28Filled, XboxConsoleFilled } from "@fluentui/react-icons";
import { setVirtualParent } from "@fluentui/dom-utilities";
import { CommandBar, ICommandBarItemProps } from "@fluentui/react/lib/CommandBar";
import Dropzone, { FileWithPath } from "react-dropzone";

// import { Button } from "antd";
import styles from "./QuestionInput.module.css";

interface Props {
    onSend: (question: string) => void;
    disabled: boolean;
    placeholder?: string;
    clearOnSend?: boolean;
}

export const QuestionInput = ({ onSend, disabled, placeholder, clearOnSend }: Props) => {
    const MyComponent = () => {
        const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

        const handleFileDrop = (acceptedFiles: File[]) => {
            setUploadedFiles(acceptedFiles);
        };

        const handleUpload = async () => {
            if (uploadedFiles.length > 0) {
                const formData = new FormData();

                uploadedFiles.forEach(file => {
                    formData.append("files", file);
                });

                try {
                    const response = await fetch("/upload", {
                        method: "POST",

                        body: formData
                    });

                    // 处理响应逻辑

                    console.log(response);
                } catch (error) {
                    console.error(error);
                }
            }
        };

        return (
            <div className={styles.uploadContainer}>
                <Dropzone onDrop={handleFileDrop}>
                    {({ getRootProps, getInputProps }) => (
                        <div {...getRootProps()}>
                            <input {...getInputProps()} multiple />

                            <button color="primary">
                                Upload
                            </button>
                        </div>
                    )}
                </Dropzone>

                {uploadedFiles.length > 0 && (
                    <div>
                        <h4>已选择的文件:</h4>

                        {uploadedFiles.map((file, index) => (
                            <p key={index}>{file.name}</p>
                        ))}

                        <button color="primary" onClick={handleUpload}>
                            上传
                        </button>
                    </div>
                )}
            </div>
        );
    };

    const [question, setQuestion] = useState<string>("");

    const _items: ICommandBarItemProps[] = [
        {
            key: "upload",
            text: "Upload",
            iconProps: { iconName: "Upload" },
            subMenuProps: {
                items: [
                    {
                        key: "uploadfile",
                        text: "File",
                        action: "/upload",
                        preferMenuTargetAsEventTarget: true,
                        onClick: (ev?: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement> | undefined) => {
                            ev?.persist();

                            Promise.resolve().then(() => {
                                const inputElement = document.createElement("input");

                                // inputElement.style.visibility = "hidden";
                                inputElement.setAttribute("type", "file");
                                document.body.appendChild(inputElement);

                                const target = ev?.target as HTMLElement | undefined;

                                if (target) {
                                    setVirtualParent(inputElement, target);
                                }

                                inputElement.click();

                                if (target) {
                                    setVirtualParent(inputElement, null);
                                }

                                /*  setTimeout(() => {
                                    inputElement.remove();
                                }, 10000); */
                            });
                        }
                    }
                ]
            }
        }
    ];

    const sendQuestion = () => {
        if (disabled || !question.trim()) {
            return;
        }
        onSend(question);

        if (clearOnSend) {
            setQuestion("");
        }
    };

    const onEnterPress = (ev: React.KeyboardEvent<Element>) => {
        if (ev.key === "Enter" && !ev.shiftKey) {
            ev.preventDefault();
            sendQuestion();
        }
    };

    const onQuestionChange = (_ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        if (!newValue) {
            setQuestion("");
        } else if (newValue.length <= 1000) {
            setQuestion(newValue);
        }
    };

    const sendQuestionDisabled = disabled || !question.trim();
    useEffect(() => {
        const event = new Event("storage");

        function inner() {
            const item = sessionStorage.getItem("inner");
            if (item) {
                setQuestion(item);
            }
        }

        window.addEventListener("storage", inner);
        return () => {
            //  window.removeEventListener("storage", inner);
            sessionStorage.setItem("inner", "");
        };
    }, []);

    return (
        <Stack horizontal={true} className={styles.questionInputContainer}>
            <TextField
                id="voice-txt"
                className={styles.questionInputTextArea}
                placeholder={placeholder}
                multiline
                resizable={false}
                borderless
                value={question}
                onChange={onQuestionChange}
                onKeyDown={onEnterPress}
            />

            <div className={styles.questionInputButtonsContainer}>
                <div
                    className={`${styles.questionInputSendButton} ${sendQuestionDisabled ? styles.questionInputSendButtonDisabled : ""}`}
                    aria-label="Ask question button"
                    onClick={sendQuestion}
                >
                    <div id="start-btn">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            // xmlns:xlink="http://www.w3.org/1999/xlink" // 话筒
                            fill="none"
                            version="1.1"
                            width="32"
                            height="32"
                            viewBox="0 0 32 32"
                        >
                            <g>
                                <g>
                                    <path
                                        d="M17.44023828125,27.008C17.44023828125,27.008,17.44023828125,29.984,17.44023828125,29.984C17.44023828125,29.984,21.82423828125,29.984,21.82423828125,29.984C21.82423828125,29.984,21.82423828125,32,21.82423828125,32C21.82423828125,32,11.07223828125,32,11.07223828125,32C11.07223828125,32,11.07223828125,29.984,11.07223828125,29.984C11.07223828125,29.984,15.45623828125,29.984,15.45623828125,29.984C15.45623828125,29.984,15.45623828125,27.008,15.45623828125,27.008C13.55756828125,26.8373,11.829568281250001,26.2187,10.27223828125,25.152C8.73623828125,24.128,7.5309082812499994,22.8053,6.65623828125,21.184C5.78157128125,19.52,5.34423828125,17.7387,5.34423828125,15.84C5.34423828125,15.84,7.36023828125,15.84,7.36023828125,15.84C7.36023828125,17.504,7.77623828125,19.04,8.60823828125,20.448C9.397568281249999,21.8347,10.48556828125,22.9333,11.872238281249999,23.744C13.28023828125,24.5547,14.80556828125,24.96,16.44823828125,24.96C18.11223828125,24.96,19.648238281250002,24.544,21.05623828125,23.712C22.44293828125,22.9227,23.53093828125,21.8347,24.32023828125,20.448C25.15223828125,19.04,25.56823828125,17.504,25.56823828125,15.84C25.56823828125,15.84,27.55223828125,15.84,27.55223828125,15.84C27.55223828125,17.7387,27.11493828125,19.52,26.24023828125,21.184C25.36553828125,22.8053,24.14953828125,24.1387,22.59223828125,25.184C21.05623828125,26.208,19.33893828125,26.816,17.44023828125,27.008ZM22.68823828125,5.856C22.62423828125,4.768,22.30423828125,3.776,21.72823828125,2.88C21.15223828125,1.984,20.39493828125,1.28,19.456238281250002,0.768C18.538938281249997,0.256,17.53623828125,0,16.44823828125,0C15.36023828125,0,14.34690828125,0.256,13.40823828125,0.768C12.49090828125,1.28,11.74423828125,1.984,11.16823828125,2.88C10.592238281250001,3.776,10.27223828125,4.768,10.20823828125,5.856C10.20823828125,5.856,10.20823828125,6.528,10.20823828125,6.528C10.20823828125,6.528,22.68823828125,6.528,22.68823828125,6.528C22.68823828125,6.528,22.68823828125,5.856,22.68823828125,5.856ZM16.44823828125,22.688C17.28023828125,22.688,18.08023828125,22.528,18.848238281249998,22.208C19.61623828125,21.888,20.288238281250003,21.4293,20.86423828125,20.832C21.46153828125,20.2347,21.92023828125,19.552,22.24023828125,18.784C22.56023828125,18.016,22.72023828125,17.216,22.72023828125,16.384C22.72023828125,16.384,22.72023828125,8.576,22.72023828125,8.576C22.72023828125,8.576,10.17623828125,8.576,10.17623828125,8.576C10.17623828125,8.576,10.17623828125,16.416,10.17623828125,16.416C10.17623828125,17.5467,10.45356828125,18.592,11.00823828125,19.552C11.58423828125,20.512,12.35223828125,21.28,13.31223828125,21.856C14.27223828125,22.4107,15.31756828125,22.688,16.44823828125,22.688Z"
                                        fill="#474747"
                                        fill-opacity="1"
                                    />
                                </g>
                            </g>
                        </svg>
                    </div>
                    <div>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            // xmlns:xlink="http://www.w3.org/1999/xlink" // 纸飞机
                            fill="none"
                            version="1.1"
                            width="36"
                            height="32"
                            viewBox="0 0 36 32"
                        >
                            <g>
                                <path
                                    d="M36,0C35.376,2.03922,34.74,4.07843,34.092,6.11765C32.676,10.6667,31.596,14.0706,30.852,16.3294C28.668,22.9176,27.048,28.0784,25.992,31.8118C25.992,31.8118,25.956,32,25.956,32C25.956,32,25.812,31.9059,25.812,31.9059C25.812,31.9059,14.436,22.2118,14.436,22.2118C14.436,22.2118,14.616,22.0706,14.616,22.0706C15.84,20.8471,19.056,17.4275,24.264,11.8118C24.264,11.8118,32.4,3.15294,32.4,3.15294C32.4,3.15294,22.968,8.89412,22.968,8.89412C22.968,8.89412,18.504,11.9059,18.504,11.9059C14.616,14.5098,11.712,16.4706,9.792,17.7882C9.672,17.8824,9.468,17.9608,9.18,18.0235C8.964,18.0235,8.76,17.9451,8.568,17.7882C8.568,17.7882,2.916,13.8353,2.916,13.8353C2.916,13.8353,0.684,12.3294,0.684,12.3294C0.588,12.2667,0.516,12.2039,0.468,12.1412C0.468,12.1412,0,11.7176,0,11.7176C0,11.7176,0.324,11.6235,0.324,11.6235C2.412,11.0588,5.04,10.2588,8.208,9.22353C10.104,8.62745,13.044,7.6549,17.028,6.30588C17.028,6.30588,18.144,5.92941,18.144,5.92941C20.736,5.05098,24.492,3.79608,29.412,2.16471C29.412,2.16471,36,0,36,0ZM32.364,3.15294C31.764,3.71765,30.636,4.9098,28.98,6.72941C28.98,6.72941,28.98,6.77647,28.98,6.77647C28.98,6.77647,32.364,3.15294,32.364,3.15294ZM27.792,7.95294C27.792,7.95294,24.228,11.8118,24.228,11.8118C24.228,11.8118,28.656,7.10588,28.656,7.10588C28.656,7.10588,27.792,7.95294,27.792,7.95294ZM26.136,8.42353C17.424,14.4471,12.228,18.0392,10.548,19.2C10.356,19.3255,10.212,19.5294,10.116,19.8118C10.356,21.9137,10.68,24.3608,11.088,27.1529C11.088,27.1529,11.268,28.3765,11.268,28.3765C11.268,28.3765,11.592,26.8706,11.592,26.8706C11.592,26.8706,11.664,26.6824,11.664,26.6824C11.976,25.1451,12.3,23.7647,12.636,22.5412C12.828,21.9137,13.116,21.4118,13.5,21.0353C13.5,21.0353,26.172,8.42353,26.172,8.42353C26.172,8.42353,26.136,8.42353,26.136,8.42353ZM29.016,6.77647C29.016,6.77647,29.016,6.72941,29.016,6.72941C29.016,6.72941,27.828,7.95294,27.828,7.95294C27.828,7.95294,29.016,6.77647,29.016,6.77647ZM13.104,29.4118C13.104,29.4118,16.452,26.4471,16.452,26.4471C16.452,26.4471,14.22,24.5647,14.22,24.5647C14.22,24.5647,13.104,29.4118,13.104,29.4118Z"
                                    fill="#D04A02"
                                    fill-opacity="1"
                                />
                            </g>
                        </svg>
                    </div>
                </div>
            </div>
        </Stack>
    );
};
