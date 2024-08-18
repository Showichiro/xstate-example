import { useMachine } from "@xstate/react";
import { machine } from "./approve-machine";
import { createBrowserInspector } from "@statelyai/inspect";
import { type ChangeEventHandler, useCallback, useState } from "react";
import "./App.css";

const { inspect } = createBrowserInspector();

function App() {
  const [state, send] = useMachine(machine, { inspect });
  const [content, setContent] = useState("");

  const handleChangeInput = useCallback<ChangeEventHandler<HTMLInputElement>>(
    ({ target: { value } }) => {
      setContent(value);
    },
    [],
  );

  const handleSubmit = useCallback(() => {
    send({ type: "submit", content });
  }, [content, send]);

  const handleApprove = useCallback(() => {
    send({ type: "approve" });
  }, [send]);

  const handleReject = useCallback(() => {
    send({ type: "reject" });
  }, [send]);

  const handleResubmit = useCallback(() => {
    send({ type: "resubmit", content });
  }, [send, content]);

  const handleCancel = useCallback(() => {
    send({ type: "cancel" });
    setContent("");
  }, [send]);

  return (
    <div className="container">
      <h2>申請フロー管理</h2>
      <p>現在の状態: {state.value}</p>
      {state.matches("draft") && (
        <>
          <input type="text" value={content} onChange={handleChangeInput} />
          <button type="button" onClick={handleSubmit}>
            提出
          </button>
        </>
      )}
      {state.matches("pending") && (
        <>
          <p>申請内容: {state.context.applicationContent}</p>
          <button type="button" onClick={handleApprove}>
            承認
          </button>
          <button type="button" onClick={handleReject}>
            差し戻し
          </button>
        </>
      )}
      {state.matches("rejected") && (
        <>
          <input type="text" value={content} onChange={handleChangeInput} />
          <button type="button" onClick={handleResubmit}>
            再提出
          </button>
        </>
      )}
      <button type="button" onClick={handleCancel}>
        取消
      </button>
    </div>
  );
}

export default App;
