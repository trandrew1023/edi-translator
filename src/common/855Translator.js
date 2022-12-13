export function to855(purchaseOrder, lineItems) {
  let text = ``;
  text = text.concat(`ISA*00*          *00*          *ZZ*`);
  text = text.concat(purchaseOrder.senderId);
  text = text.padEnd(text.length + (15 - purchaseOrder.senderId.length));
  text = text.concat(`*ZZ*`);
  text = text.concat(purchaseOrder.receiverId);
  text = text.padEnd(text.length + (15 - purchaseOrder.receiverId.length));
  text = text.concat(`*`);
  text = text.concat(purchaseOrder.purchaseOrderDate.format('YYMMDD'));
  text = text.concat(`*`);
  text = text.concat(purchaseOrder.purchaseOrderTime.format('HHmm'));
  text = text.concat(`*U*00401*200001*0*P*>\\GS*PR*`);
  text = text.concat(purchaseOrder.senderId);
  text = text.concat(`*`);
  text = text.concat(purchaseOrder.receiverId);
  text = text.concat(`*`);
  text = text.concat(purchaseOrder.purchaseOrderDate.format('YYYYMMDD'));
  text = text.concat(`*`);
  text = text.concat(purchaseOrder.purchaseOrderTime.format('HHmm'));
  text = text.concat(`*300001*X*004010\\ST*855*400001\\BAK*00*`);
  text = text.concat(purchaseOrder.acknowledgementType);
  text = text.concat(`*`);
  text = text.concat(purchaseOrder.purchaseOrderNumber);
  text = text.concat(`*`);
  text = text.concat(purchaseOrder.purchaseOrderDate.format('YYYYMMDD'));
  text = text.concat(`\\`);
  lineItems.forEach((lineItem, index) => {
    text = text.concat(`PO1*`);
    text = text.concat(index + 1);
    text = text.concat(`*`);
    text = text.concat(lineItem.orderedQuantity);
    text = text.concat(`*`);
    text = text.concat(lineItem.unitOfMeasure);
    text = text.concat(`****VN*`);
    text = text.concat(lineItem.item);
    text = text.concat(`\\PID*F****`);
    text = text.concat(lineItem.description);
    text = text.concat(`\\ACK*`);
    text = text.concat(lineItem.acknowledgementStatus);
    text = text.concat(`*`);
    text = text.concat(lineItem.acknowledgedQuantity);
    text = text.concat(`*`);
    text = text.concat(lineItem.unitOfMeasure);
    text = text.concat(`\\`);
  });
  text = text.concat(`CTT*`);
  text = text.concat(lineItems.length)
  text = text.concat(`\\SE*`);
  text = text.concat(`12`);
  text = text.concat(`*400001\\GE*1*300001\\IEA*1*200001\\`);
  return text;
}

export function from855() {

}