(function () {

    class WebFile {
        constructor(file) {
            this.file = file;
            this.offset = 0;
            this.chunkSize = 8 * 1024
        }

        async ReadBlock() {
            if (this.offset >= this.file.size) return null;

            let slice = this.file.slice(this.offset, this.offset + this.chunkSize);
            let reader = new FileReader();

            return new Promise((resolve, reject) => {
                reader.onload = (e) => {
                    this.offset += this.chunkSize;
                    resolve(e.target.result);
                };
                reader.onerror = reject;
                reader.readAsText(slice);
            });
        }
    }

    class WebFileLine {
        constructor(file) {
            this.webFile = new WebFile(file);
            this.buffer = "";
            this.lines = [];
        }

        async ReadLine() {
            while (this.lines.length === 0) {
                let chunk = await this.webFile.ReadBlock();
                if (chunk === null) {
                    if (this.buffer) {
                        let lastLine = this.buffer;
                        this.buffer = "";
                        return lastLine;
                    }
                    return null;
                }

                this.buffer += chunk;
                let parts = this.buffer.split(/\r?\n/);
                this.buffer = parts.pop(); // Save incomplete line
                this.lines = parts;
            }
            return this.lines.shift();
        }
    }

    const webFile = (file) => new WebFile(file);
    const webFileLine = (file) => new WebFileLine(file);

    window.i6 = window.i6 || {};
    window.i6.webFile = webFile;
    window.i6.webFileLine = webFileLine
})();