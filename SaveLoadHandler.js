export {save, load}

//arr is a 2D arr of floats
function save(arr, fileName){
    const data = new Blob([JSON.stringify(arr)], {type: "text/plain"})

    //Create URL for the blob
    const url = URL.createObjectURL(data);

    //Create temp element
    const tempElement = document.createElement("a");
    tempElement.setAttribute("type", "hidden");//Just in case: we don't want it to be visible
    tempElement.href = url;
    tempElement.download= fileName;

    //Trigger a click to start download
    tempElement.click();

    //Clean up
    URL.revokeObjectURL(url);
    tempElement.remove();
}
    
    
function load(dataStr){
    return stringTo2DArray(dataStr);
}


function stringTo2DArray(str) {
    // Remove leading and trailing whitespaces and newline characters
    str = str.trim();
    // Remove square brackets if they enclose the string
    if (str.startsWith("[[") && str.endsWith("]]")) {
        str = str.substring(2, str.length - 2);
    }
    // Split the string into rows
    let rows = str.split("],");
    // Remove square brackets from each row
    rows = rows.map(row => row.replace("[", "").replace("]", ""));
    // Parse each row into an array
    let result = rows.map(row => row.split(",").map(parseFloat));
    return result;
}

