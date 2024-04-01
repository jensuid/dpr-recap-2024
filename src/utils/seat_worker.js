importScripts('saint_lague.js');

const baseDapilUrl = 'https://sirekap-obj-data.kpu.go.id/pemilu/hhcd/pdpr/';
const baseCalegUrl = 'https://sirekap-obj-data.kpu.go.id/pemilu/caleg/partai/';


function responData(e) {
    const [id,data] = e.data;
    const num_data = data.length;
    // looping with setinterval
    let index = -1
    const allTask = []
    const doLoop = setInterval(() => {
        index++;
        //console.log('loop #',id,' :',index);
        if (index >= num_data) {
            clearInterval(doLoop);
            Promise.allSettled(allTask)
            .then(() => console.log(`worker #${id} done all task`))
        }
        else {
        let thisIndex = index;
        const task = Promise.allSettled(processArea(data[thisIndex]))
        .then(() => console.log(`worker #${id} area [${data[thisIndex]}] OK.`));
        allTask.push(task)
    }
    },);

};

function processArea(area){
    const dapilUrl = baseDapilUrl+area+'.json';
    const calegUrl = baseCalegUrl+area+'.json';
    const task1 = fetch(dapilUrl)
                  .then( res => res.json())
                  .then(() => {});

    const task2 = fetch(calegUrl)
                  .then( res => res.json())
                  .then(() => {});
   
    return [task1,task2]             
}

this.onmessage=responData

function processLoop(e){
   [id,data] = e.data;
   let counter = 0;
   const num_data = data.length;
   // all task
   allTask = []

   console.log('worker #',id,' inisiated');
   data.forEach(area => {
        //rekap dapil
        dapilUrl = baseDapilUrl+area+'.json';
        const step1 = fetch(dapilUrl)
        .then(res => res.json())
        .then( out => {
            //console.log(`worker #${id} [${area}] .`)
        })

        //get caleg json
        calegUrl = baseCalegUrl+area+'.json';
        const step2 = fetch(calegUrl)
        .then(res => res.json())
        .then( out => {
            //console.log(`worker #${id} [${area}] .. `);
            
        });
        const task = Promise.allSettled([step1,step2]).
        then(() => {
            counter++;
            if (counter >= num_data)
            console.log(`worker #${id} get done ${counter} data`)}
        );
        allTask.push(task);
        
   });
   Promise.allSettled(allTask)
   .then(() => console.log('All task get done '));
};



// ---- calculate seat alocation
// loop all dapil
// cleaning data
// calculate
// post result to main controller
// getting candidate selected 

//
// ---- function  perform getCandidatSelected
// from data result calc saint lague (dapil, party , seat,number)
// split data to n worker
// create n worker
// post command worker  to get all rekap condidat
// get all result
// post result to main controller

