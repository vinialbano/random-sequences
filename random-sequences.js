const {promisify} = require('util');

const readFile = promisify(require('fs').readFile);
const writeFile = promisify(require('fs').writeFile);

const RANDOM_SEQUENCES_QUANTITY = Number(process.argv[2]);
const READ_FILE_PATH = process.argv[3];
const WRITE_FILE_PATH = process.argv[4];

async function sequencesFileToObjectArray(file) {
    let data;
    try {
        data = await readFile(file, 'utf8');
    } catch (err) {
        return Promise.reject(new Error('Cannot read file'));
    }
    const lines = data.split(/\r\n|\n/);

    let arr = [];
    for (let i = 0; i + 1 < lines.length; i = i + 2) {
        let tuple = {
            [lines[i]]: lines[i + 1]
        };
        arr.push(tuple)
    }

    return Promise.resolve(arr);
}

function getRandomSequences(sequencesArray, quantity) {
    if (sequencesArray.length <= quantity) return sequencesArray;

    let outputArray = [];

    while (outputArray.length < quantity) {
        const randomIndex = Math.random() * sequencesArray.length;
        let randomSequence = sequencesArray.splice(randomIndex, 1)[0];
        outputArray.push(randomSequence);
    }

    return outputArray;
}

function sequencesArrayToString(sequencesArray) {
    return sequencesArray.reduce((str, sequence) => {
        let sequenceName = Object.keys(sequence)[0];
        return str + `${sequenceName}\r\n${sequence[sequenceName]}\r\n`;
    }, '')
}

sequencesFileToObjectArray(READ_FILE_PATH)
    .then((arr) => {
        const randomSequences = getRandomSequences(arr, RANDOM_SEQUENCES_QUANTITY);
        const sequencesString = sequencesArrayToString(randomSequences);

        return writeFile(WRITE_FILE_PATH, sequencesString)
            .then(() => console.log('Output file created successfully!'))
            .catch(err => Promise.reject(new Error('Cannot write to file')))
    })
    .catch(err => console.error(err));
