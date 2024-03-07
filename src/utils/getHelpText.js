function getHelpText() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'README.md', true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const readmeContent = xhr.responseText;
            window.alert(readmeContent);
        }
    };
    xhr.send();
};

export default getHelpText
