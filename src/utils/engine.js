//test worker generator
//data maust be cloneable ,
//generator is not cloneable
// import * as echars from 'echart'
//new api
urlrekap = 'https://sirekap-obj-data.kpu.go.id/pemilu/hr/pdpr/3102dc.json';
urlcaleg = 'https://sirekap-obj-data.kpu.go.id/pemilu/caleg/partai/3102.json';


function readData(){
   const task1 = fetch(urlrekap)
    .then(res => res.json())
    .then( data => rawrekap = data);
    //caleg
    const task2 = fetch(urlcaleg)
    .then(res => res.json())
    .then( data =>  candidate = data);

  Promise.allSettled([task1,task2])
  .then(data => {
     areaRecap = rawrekap.chart;
     candRecap = rawrekap.table;
     // find wilaya
  }
  );
};

function fetchAreaJson(area){
    const urlRecap = `https://sirekap-obj-data.kpu.go.id/pemilu/hr/pdpr/${area}dc.json`;
    const urlCandidate = `https://sirekap-obj-data.kpu.go.id/pemilu/caleg/partai/${area}.json`;

    const task1 = fetch(urlRecap)
     .then(res => res.json())
     .then( data => {return data});
     //caleg
     const task2 = fetch(urlCandidate)
     .then(res => res.json())
     .then( data =>  {return data});
 
    return Promise.allSettled([task1,task2])
   .then(data => {
       rawRecap = data[0];
       //candRecap = data[0];
       candidate = data[1]
      //return [task1,task2]
   }
   );
 };


// aggreagtion recap candidate by area (based on subarea votes)
function candidateTabulatebyArea(candidate,recap){
    // parameter candidate data and recap by candidate by area
    // candidate { party : {id : { candidate data} }}
    // recap {area : { id : votes}} 
    let objResult = {}
    //console.log('candidate rekap : ',recap)
    //need check only area not null
    for (let [area, objRecap] of Object.entries(recap)) { 
        //console.log('calcuting area ',area)
        if (objRecap) {
            //console.log('obj ',objRecap);
        for (let [party,objCand] of Object.entries(candidate)){ 
            for (let [id, cand] of Object.entries(objCand))  {
                if (id){
                  //console.log('id :',id,'party : ',party);
                  if (!objResult?.[party]) {objResult[party] = { 'votes' : {}, 'sorted' : {} };};
                  if (!objResult[party]?.[id]) {objResult[party]['votes'][id] = { 'value': 0 , 'info' : cand }};
                  const acc = objResult[party]['votes'][id]?.['value'] ?? 0 ;
                  //console.log('output obj',Object.keys(objResult[party]['votes'][id]));
                  //console.log('obj :',objRecap[id],objResult[party]['votes'][id],' acc :',acc);
                  objResult[party]['votes'][id]['value'] =  acc +  objRecap[id];
                  //console.log(' updated :',objResult[party][id]);
                }
            };
        };
    }
    };
    // need to be sort by votes (rank)
    for (let [party,recap] of Object.entries(objResult)){
         //recap.votes = object {id ; {value,info} }
         //const data = Object.entries(recap.votes); // list [key,val] 
         //const id = data.map(item => item[0]);
         const data  = {};
         for (let [id,content] of Object.entries(recap.votes)){
             data[id] = content.value
         };
         objResult[party]['sorted'] = [sortObj(data,asc=false)];
    } 
    return objResult
   };
  // 
//};

// National recapitulation steps
// get list all area and seats allocation
// loop all area 
//  ---get data area recap and aggregate
// calc national recap
// apply threshold votes
// filter only passed party to be counted
// alocate seat by area
// {ok}grab data candidat recap and transform for further analysis
// {ok}sort data by party by most votes rank
// determine candidat selected 

// ----- national ----  
// template json request
function fetchDataArea(endpoint,area){
    const urlRecap = `https://sirekap-obj-data.kpu.go.id/pemilu/hr/pdpr/${area}dd.json`;
    const urlCandidate = `https://sirekap-obj-data.kpu.go.id/pemilu/caleg/partai/${area}.json`;
    if (endpoint && area){
        switch (endpoint) {
            case 'recap' :
                return fetch(urlRecap).then(res => res.json());
                break;
            case 'candidate' :
                return fetch(urlCandidate).then(res => res.json());
                break;

        }
    }
};

async function fetchAreaData(endpoint,area){
    const urlRecap = `https://sirekap-obj-data.kpu.go.id/pemilu/hr/pdpr/${area}dd.json`;
    const urlCandidate = `https://sirekap-obj-data.kpu.go.id/pemilu/caleg/partai/${area}.json`;
    if (endpoint && area){
        switch (endpoint) {
            case 'recap' :
                 fetch(urlRecap).then(function(res){ return res.json()});
                break;
            case 'candidate' :
                return fetch(urlCandidate).then(function(res){ return res.json()});
                break;

        }
    }
};

// get list all dapil and seats allocation
function getListArea(){
fetch('dpr_dapil_new.json')
.then(res => res.json())
.then( data => Model['dapildb'] = data)
};

function nationalRecap(){
    // list all area
    // loop area
    const accNational = {};
    const areaError = [];
    const allfetch = [];
    const accCandVotes = {}

    for (let area of Model.dapildb ){
        ({ nama_dapil,kode_dapil,kursi} = area);
        // fetching json area
        pRecap = fetchDataArea('recap',kode_dapil);
        pCandidate = fetchDataArea('candidate',kode_dapil);
        pInfo = new Promise(function(resolve,reject){
            resolve(area)
        });
        pArea = Promise.allSettled([pRecap,pCandidate,pInfo]);
        //both data mast be ready (promise done)
        allfetch.push(pArea); // to check all area fetch
        pArea.then(data => {
            // data is list 
            const candRecap = data[0].value.table;
            const areaRecap = data[0].value.chart;
            const areaCandidate = data[1].value;
            const info = data[2].value;
            ({ nama_dapil : nama, kode_dapil : dapil, 
             kursi :seat} = info);
            console.log('Area ',nama,'-',dapil);
    
            // ----process area recap--------
            if (areaRecap) {
            for (let [party,value] of Object.entries(areaRecap)){
                ({jml_suara_total:total} = value ) ;
                //summation aggreagate 
                if (!accNational?.[party]) accNational[party] = 0;
                accNational[party] += total;  
                };

            // -----process candidat recap -----
            const areaTabulated = candidateTabulatebyArea(areaCandidate,candRecap);
            accCandVotes[dapil] = areaTabulated;

            } else
            { areaError.push(dapil)}

        });
    }
    return  Promise.allSettled(allfetch).then((data) => { 
        console.log('result :',accNational);
        Model['national'] =  {
            votes : accNational,
            dapil_no_data : areaError
           };
        Model['recap'] = accCandVotes;
        
        //------ threshold calculation
        Model.national['percentage']=transformPercent(accNational);
        Model.national['maskNotPassed']=createMaskNotPassed(accNational);
        Model.national['thresholdPassed']=objectFilter(Model.national.percentage,([k,v]) => v >= 4.0);
        //------ determinte elected candidate
        
     });
     
};

// utils 
// function map object
function objectMap(obj,fn,value=''){
    if (!value && obj && fn ){
       const temp = Object.entries(obj).map(fn);
       return Object.fromEntries(temp);
    }
};
// object filter
function objectFilter(obj,fn,value=''){
    if (!value && obj && fn ){
       const temp = Object.entries(obj).filter(fn);
       return Object.fromEntries(temp);
    }
}

// function percentage
function transformPercent(obj){
    if (obj){
        const total = Object.values(obj).reduce((acc,v) => acc+v);
        return objectMap(obj,([a,b]) => [a,(100*b/total).toFixed(2)])
    }
}

// function create mask not pass threshold
function createMaskNotPassed(obj){
    if (obj){
        return objectMap(objectFilter(transformPercent(obj),([k,v])=> v<4.0),([k,v])=>[k,0])
    }
}

// create object pair key-value from 2 array
function pairArraytoObject(aKey,aValue){
    let result = {}
    // aKey.forEach((key,idx) => {
    //     result[key] = aValue[idx];
    // });
    const _ = aKey.map(function(k,idx){
        result[k] = aValue[idx];
    });
    return result;
};

function sumCandidateVotesArea(data,candidateData){
    // get list all key candidate
    // ignore party name 
    const result = {};
    const subAreas = Object.keys(data);
    // ------ do summation aggregating each candidate by party 
    for ( let [party,infoCandidate] of Object.entries(candidateData)){
        const candidates = Object.keys(infoCandidate);     
        // loop each candidate
        const objCandidates = {}
        candidates.forEach( (candidate) =>{
            ({ nama , nomor_urut} = infoCandidate[candidate]);
           // loop subarea
           let totalVotes = 0;
           for (let subArea of subAreas){
               if (data[subArea]) {
                   totalVotes += data[subArea][candidate];}
                   //do summation aggregate
           }
           objCandidates[candidate] = { 'nama' : nama, 'no_urut' : nomor_urut, 'suara' : totalVotes };
         })
         // ------ do sorting candidate each party by votes
         // format : id : votes
         const sortedValue = sortObj(objectMap(objCandidates,([k,v]) => 
                                    [k,v.suara]),asc=false);
         //result id : votes => return back original data
         const sortedCandidates =[];
         sortedValue.forEach((id) => { sortedCandidates.push( objCandidates[id[0]])});

         result[party] = sortedCandidates;
    };
    
    return result;
};

// ------- sumNationalVotes()
async function summarizeNationalVotes(allArea) {
    // data is list all area kode and seats alocation
    const data = allArea.map(item => item[0]);
    const nationalVotes = {};
    const areaVotes = {};
    const areaNoData = [];
    const areaFetchError = [];
    const candidateVotes = {};
    const seatsAllocated = {};

    if (data) {
    // loop all Area
    const promiseTask = await Promise.all(
       data.map(async (area) => {
          // fetch data area 
          const areaData = await fetchDataArea('recap',area); 
          if (areaData){

          // ----- process party votes data ------
          const areaRecap = objectMap(areaData.chart,([party,content]) => 
            [party,content.jml_suara_total]);
          if (areaRecap){
                areaVotes[area] = areaRecap; //store area recapitulation
                for (let [party,value] of Object.entries(areaRecap)){
                    //summation aggreagate 
                    if (!nationalVotes?.[party]) nationalVotes[party] = 0;
                    nationalVotes[party] += value;
                    };
          } else { areaNoData.push(area) }

          //---- processing candidate votes data ----
          const candidateRecap = areaData.table;
          const candidates = await fetchDataArea('candidate',area);
          if (candidates){
            candidateVotes[area] =  sumCandidateVotesArea(candidateRecap,candidates);
          }

       } else { areaFetchError.push(area)};

    }))};
    // ------- determine passed party by threshold
    const percentageVotes  = transformPercent(nationalVotes);
    const notPassedMask = createMaskNotPassed(nationalVotes);
    const thresholdPassedParty =objectFilter(percentageVotes,([k,v]) => v >= 4.0);
    // ---------- determine elected candidate
    const seatsNational = {} ;
    allArea.forEach( (content)  => {
        const [area, numSeats]  = content;
        const copyAreaVotes = structuredClone(areaVotes[area]);
        const seatsArea  = saint_lague(numSeats,Object.assign(copyAreaVotes,notPassedMask));
        // selected candidate
        const record = {}
        for ( let [party,seats] of Object.entries(seatsArea.seats) ) {
            // store only party has seats
            if (seats > 0) {
            record[party] = {
                seats : seats,
                candidate_elected : candidateVotes[area][party].slice(0,seats),
                rounds_saint_lague : seatsArea.rounds[party]
            };}
            // summarize seats national
            if (!seatsNational?.[party]) seatsNational[party] = 0;
            seatsNational[party] += seats;

        };
        seatsAllocated[area] = {data : record,
            rounds_saint_lague : seatsArea.rounds};
            
    });
    // transform data
    Object.entries(nationalVotes).forEach(([party,votes])=> {
        nationalVotes[party] = {
              total : votes,
              persen : percentageVotes[party],
              seats : seatsNational[party]
        }});

    return { national_votes : nationalVotes,
            area_votes : areaVotes , 
            seats_allocated : seatsAllocated,
            threshold_passed_party : thresholdPassedParty
           };

};  
//     
//-----------------
// filter only passed party
// {'1' : 5,''
//

// load initial data
// dapil, partai
const Model = {};
