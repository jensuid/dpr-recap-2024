
function saint_lague(numSeat,data){
    const seats = {}
    const quotient = {}
    const rounds = {}
    //data is Object {party : votes}
    Object.entries(data).forEach(
        ([party,val]) => {
            seats[party] = 0
            //rounds[party] = []

            quotient[party] = val
        }
        
    );

    for(let seat=1; seat <= numSeat;seat++){
        //get max quetiens
        let qv = Object.values(quotient);
        let idmax = qv.indexOf(Math.max(...qv));
        let party = Object.keys(quotient)[idmax]
        let cost = Math.round(quotient[party])
         
        //alocate party seat
        //console.log(idmax,party,cost);
        seats[party] += 1
       // rounds[party].push(seat+1)
        // store only party has seats
        if (!rounds?.[party]) {rounds[party] = [{round : seat , cost : cost}]}
        else {rounds[party].push({round : seat , cost : cost})}; 
        // recalculate quotient
        let ratio = 1 + seats[party] *2
        quotient[party] = data[party] / ratio
    };
        
    return { 'seats' :seats, 'rounds' :rounds}
};

function sortObj(obj,asc=true)
 {
     return  asc ? Object.entries(obj).sort((a,b)=> a[1]-b[1]) :
     Object.entries(obj).sort((a,b)=> b[1]- a[1])
};

dtest = {
    '1': 5000,
    '2': 7500,
    '3': 25000,
    '4': 5700,
    '5': 9500,
    '6': 1000,
    '7': 5600,
    '8': 500,
    '9': 1500,
}