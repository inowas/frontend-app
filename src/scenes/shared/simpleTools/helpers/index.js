import * as ReactDOM from "react-dom";

export const getParameterValues = (arr) => {
    const parameters = {};
    arr.forEach(item => {
        parameters[item.id] = item.value
    });

    return parameters;
};

export const deepMerge = (state, fetched) => {
        const fetchedParams = fetched.data.parameters;
        const mergedParams = state.data.parameters.map(
            mergedParam => {
                const fetchedParam = fetchedParams.find(fp => fp.id === mergedParam.id);
                return {...mergedParam, ...fetchedParam}
            }
        );

        return {
            ...state,
            id: fetched.id,
            name: fetched.name,
            description: fetched.description,
            permissions: fetched.permissions,
            public: fetched.public,
            data: {
                ...fetched.data,
                parameters: mergedParams
            }
        };
    }
;

export const buildPayload = (tool) => ({
    id: tool.id,
    name: tool.name,
    description: tool.description,
    public: tool.public,
    type: tool.type,
    data: {
        ...tool.data,
        parameters: tool.data.parameters.map(p => ({
            id: p.id,
            max: p.max,
            min: p.min,
            value: p.value
        }))
    }
});

export const downloadFile = (name, uri) => {
    const downloadLink = document.createElement("a");
    downloadLink.href = uri;
    downloadLink.download = name;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
};

export const exportChartData = (ref) => {
    const rows = ref.props.data;
    const keys = Object.keys(rows[0]);

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += keys.join(',');
    csvContent += '\r\n';

    rows.forEach((row) => {
        csvContent += Object.values(row).join(',');
        csvContent += '\r\n';
    });

    const encodedUri = encodeURI(csvContent);

    downloadFile('chart.csv', encodedUri);
};

export const exportChartImage = (ref) => {
    const svg = ReactDOM.findDOMNode(ref).children[0];

    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    const svgData = svg.outerHTML;
    const preface = '<?xml version="1.0" standalone="no"?>\r\n';
    const svgBlob = new Blob([preface, svgData], {type: "image/svg+xml;charset=utf-8"});
    const svgUrl = URL.createObjectURL(svgBlob);

    const canvas = document.createElement("canvas");
    const bbox = svg.getBBox();
    canvas.width = bbox.width + 50;
    canvas.height = bbox.height + 50;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, bbox.width, bbox.height);

    const img = new Image();
    img.onload = () => {
        ctx.drawImage(img, 15, 15);
        URL.revokeObjectURL(svgUrl);
        const imgURI = canvas
            .toDataURL("image/png")
            .replace("image/png", "image/octet-stream");

        downloadFile('chart.jpg', imgURI);
    };
    img.src = svgUrl;
};