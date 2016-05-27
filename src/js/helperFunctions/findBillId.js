/*If the votes is about a bill, there is a urlBill looking like that:  "/bills/42-1/C-14/". 
If it's not about a bill, its urlBill is null.
The bill number is the last part of the urlBill,
so we keep only what is coming after the penultimate forward slash and 
remove the last one. 
*/
var findBillId = function (urlBill) {
    if(urlBill === null) {
        return "";
    }
    else{
        var partsOfBill = urlBill.substring(-1, urlBill.length-1).split("/");
        return partsOfBill[partsOfBill.length-1];
    }
};

module.exports = findBillId;