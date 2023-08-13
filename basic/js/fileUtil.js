function testFileSystemAccesAPISupport() {
    if ('showSaveFilePicker' in window && 'createWritable' in FileSystemFileHandle.prototype) {
        return true;
    } else {
        console.log('File System Access API not supported');
        return false;
    }
}


async function saveObjAsJson(obj, suggestedName = "data.json") {
    if (!testFileSystemAccesAPISupport()) {return};
    const jsonString = JSON.stringify(obj, null, 2);
    const jsonBlob = new Blob([jsonString], { type: 'application/json' });

    try {
        const fileHandle = await window.showSaveFilePicker({
        suggestedName,
        types: [
            {
            description: 'JSON File',
            accept: {
                'application/json': ['.json'],
            },
            },
        ],
        });

        const writableStream = await fileHandle.createWritable();
        await writableStream.write(jsonBlob);
        await writableStream.close();

        console.log('JSON saved successfully!');
    } catch (err) {
        console.error('Error while saving JSON file:', err);
    }
}


class ImageSequenceSaver {

    async showDirectoryPicker() {
        if (!testFileSystemAccesAPISupport()) {return};
        this.folderHandle = await window.showDirectoryPicker();
        this.initialized = true;
        this.count = 0;
    }

    async saveCanvasImage(canvas) {
        if (!this.initialized) {return;}
        try {
            const blob = await new Promise((resolve) => canvas.toBlob(resolve));

            const numString = this.count.toString().padStart(6, '0');
            const fileName = `image${numString}.png`
            this.count ++;
            const fileHandle = await this.folderHandle.getFileHandle(fileName, {
            create: true,
            });
    
            const writableStream = await fileHandle.createWritable();
            await writableStream.write(blob);
            await writableStream.close();
    
            console.log(`saved ${fileName}`);
        } catch (err) {
          console.error('Error saving images:', err);
        }
    }
}
