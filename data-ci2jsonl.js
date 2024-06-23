
const fs = require('fs');
const { json } = require('stream/consumers');

jsonl=fs.readFileSync("data\\ci.json")
jsonl=jsonl.toString()
//替换所有\n\n


//jsonl2=jsonl.map(JSON.parse).map(j=>JSON.stringify({"text": `User: ${j.question}\n\nAssistant: ${j.answer}`}))
//循坏读取 json文件中的元素
jsonl=JSON.parse(jsonl)
jsonl2=[]

let questions = [
  "请问你能解释一下这个中文词语[word]吗？",
  "你能告诉我[word]这个词语的用法吗？",
  "请教一下，[word]这个中文词语是什么意思？",
  "请问你能解释一下[word]这个词语吗？",
  "请问[word]这个词在中文里代表什么？",
  "你能告诉我[word]这个词的用法吗？",
  "请描述一下[word]的意思。",
  "请解释一下[word]的意思。",
  "[word]这个词的含义是什么？",
  "我不太明白[word]这个词语的意思,能不能给我解释一下？",
];

let answers = [
  "[word]的意思是：[answer]",
  "[word]的解释是：[answer]",
  "[word]这个词的解释：[answer]",
  "[word]这个词的意思：[answer]",
  "[word]这个词语的意思是：[answer]",
  "[word]这个词语的解释是：[answer]",
  "下面是关于[word]这个词的解释：[answer]",
];




const asks1 = [...new Set(questions)];
console.log(asks1)
let maxlen = 0;

for (let i = 0; i < jsonl.length; i++) {
  const element = jsonl[i];
  //console.log(element)
  let explanation = element.explanation.replace(/\n\n/g,"\n").replace(/\n \n/g,"\n").replace(/～/g,element.word)

  //循环asks1
  for (let j = 0; j < asks1.length; j++) {
    let asks2 = asks1[j].replace("[word]",element.word)
    let json_add = JSON.stringify({"text": `User: ${asks2}\n\nAssistant: # ${element.word}:\n${duyin2}\n${bihua2}\n- 释义: ${explanation}\n\n`})
    if(json_add.length>maxlen){
      maxlen=json_add.length
    }
    jsonl2.push(json_add)

  }
}

console.log("max length: ",maxlen)

//打乱jsonl2 排序，随机排序
jsonl2=jsonl2.sort(()=>Math.random()-0.5)

const path = 'ci.jsonl';
const batchSize = 1000; // 每次写入的元素数量
let currentBatch = [];

for (const element of jsonl2) {
  currentBatch.push(element);
  if (currentBatch.length === batchSize) {
    // 当当前批次达到指定大小时，将其写入文件
    fs.appendFileSync(path, currentBatch.join('\n') + '\n');
    currentBatch = []; // 重置当前批次
  }
}

// 写入剩余的批次（如果有的话）
if (currentBatch.length > 0) {
  fs.appendFileSync(path, currentBatch.join('\n') + '\n');
}
