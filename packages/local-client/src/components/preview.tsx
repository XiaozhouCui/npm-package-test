import { useEffect, useRef } from "react";
import "./preview.css";

// receive bundled code as props
interface PreviewProps {
  code: string;
  err: string;
}

// prepare the bundled code to be executed in iframe as srcDoc
const html = `
    <html>
      <head>
        <style>html { background-color: white; }</style>
      </head>
      <body>
        <div id="root"></div>
      </body>
      <script>
        const handleError = (err) => {
          const root = document.querySelector('#root');
          root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>';
          console.error(err);
        };

        // catch async error
        window.addEventListener('error', (event) => {
          event.preventDefault(); // error will be printed in handleError()
          handleError(event.error);
        });

        window.addEventListener('message', (event) => {
          try {
            eval(event.data);
          } catch (err) {
            // catch sync error
            handleError(err);
          }
        }, false)
      </script>
    </html>
  `;

const Preview: React.FC<PreviewProps> = ({ code, err }) => {
  const iframe = useRef<any>();

  useEffect(() => {
    // reset iframe html template when props "code" changes
    iframe.current.srcdoc = html;

    // emit a message event to pass data (bundled code) to iframe
    setTimeout(() => {
      // inside iframe, an event listener is added to catch the data in message event
      iframe.current.contentWindow.postMessage(code, "*");
    }, 50); // allow 50 ms to setup event listener
  }, [code]);

  // execute user's code inside an iframe - SAFER for parent react app
  // "sandbox" attr can disable direct js communication between parent and child iframe
  return (
    <div className="preview-wrapper">
      <iframe
        ref={iframe}
        title="preview"
        sandbox="allow-scripts"
        srcDoc={html}
      />
      {err && <div className="preview-error">{err}</div>}
    </div>
  );
};

export default Preview;
