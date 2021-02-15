import { useTypedSelector } from "./use-typed-selector";

export const useCumulativeCode = (cellId: string) => {
  return useTypedSelector((state) => {
    const { data, order } = state.cells;
    const orderedCells = order.map((id) => data[id]);
    // prepare a show() function for all code cells
    const showFunc = `
      import _React from 'react';
      import _ReactDOM from 'react-dom';
      var show = (value) => {
        const root = document.querySelector('#root');

        if (typeof value === 'object') {
          if (value.$$typeof && value.props) {
            _ReactDOM.render(value, root)
          } else {
            root.innerHTML = JSON.stringify(value);
          }
        } else {
          root.innerHTML = value
        }
      }
    `;
    const showFuncNoOp = "var show = () => {}";

    const cumulativeCodeArray = [];
    for (let c of orderedCells) {
      if (c.type === "code") {
        if (c.id === cellId) {
          // only add showFunc for current cell
          cumulativeCodeArray.push(showFunc);
        } else {
          // for previous cell inputs, don't display result in current cell's preview iframe
          cumulativeCodeArray.push(showFuncNoOp);
        }
        cumulativeCodeArray.push(c.content);
      }
      if (c.id === cellId) {
        break;
      }
    }
    return cumulativeCodeArray;
  }).join("\n");
};
