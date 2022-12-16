export function to855(purchaseOrder, lineItems) {
  let text = ``;
  let numberOfSegments = 0;
  text = text.concat(`ISA*00*          *00*          *ZZ*`);
  text = text.concat(purchaseOrder.senderId);
  text = text.padEnd(text.length + (15 - purchaseOrder.senderId.length));
  text = text.concat(`*ZZ*`);
  text = text.concat(purchaseOrder.receiverId);
  text = text.padEnd(text.length + (15 - purchaseOrder.receiverId.length));
  text = text.concat(`*`);
  text = text.concat(purchaseOrder.poDate.format('YYMMDD'));
  text = text.concat(`*`);
  text = text.concat(purchaseOrder.poDate.format('HHmm'));
  text = text.concat(`*U*00401*200000001*0*P*>\\GS*PR*`);
  text = text.concat(purchaseOrder.senderId);
  text = text.concat(`*`);
  text = text.concat(purchaseOrder.receiverId);
  text = text.concat(`*`);
  text = text.concat(purchaseOrder.poDate.format('YYYYMMDD'));
  text = text.concat(`*`);
  text = text.concat(purchaseOrder.poDate.format('HHmm'));
  text = text.concat(`*300000001*X*004010\\ST*855*40001\\BAK*00*`);
  numberOfSegments++; // ST
  text = text.concat(purchaseOrder.acknowledgementType);
  text = text.concat(`*`);
  text = text.concat(purchaseOrder.purchaseOrderNumber);
  text = text.concat(`*`);
  text = text.concat(purchaseOrder.poDate.format('YYYYMMDD'));
  text = text.concat(`\\`);
  numberOfSegments++; // BAK
  if (purchaseOrder.headerComment) {
    text = text.concat(`N9*L1*SEE COMMENTS\\MSG*`);
    text = text.concat(purchaseOrder.headerComment);
    text = text.concat(`\\`);
    numberOfSegments += 2;
  }
  if (purchaseOrder.accountNumber) {
    text = text.concat(`N1*ST**91*`);
    text = text.concat(purchaseOrder.accountNumber);
    text = text.concat(`\\`);
    numberOfSegments++;
  }
  if (purchaseOrder.sentFrom) {
    text = text.concat(`N1*SE**91*`);
    text = text.concat(purchaseOrder.sentFrom);
    text = text.concat(`\\`);
    numberOfSegments++;
  }
  lineItems.forEach((lineItem, index) => {
    text = text.concat(`PO1*`);
    text = text.concat(index + 1);
    text = text.concat(`*`);
    text = text.concat(lineItem.orderedQuantity);
    text = text.concat(`*`);
    text = text.concat(lineItem.unitOfMeasure);
    text = text.concat(`*`);
    text = text.concat(lineItem.price);
    text = text.concat(`**VN*`);
    text = text.concat(lineItem.item);
    if (lineItem.description) {
      text = text.concat(`\\PID*F****`);
      text = text.concat(lineItem.description);
      numberOfSegments++;
    }
    text = text.concat(`\\ACK*`);
    text = text.concat(lineItem.acknowledgementStatus);
    text = text.concat(`*`);
    text = text.concat(lineItem.acknowledgedQuantity);
    text = text.concat(`*`);
    text = text.concat(lineItem.unitOfMeasure);
    text = text.concat(`\\`);
    numberOfSegments += 2;
  });
  text = text.concat(`CTT*`);
  text = text.concat(lineItems.length);
  numberOfSegments++; // CTT
  text = text.concat(`\\SE*`);
  numberOfSegments++; // SE
  text = text.concat(numberOfSegments);
  text = text.concat(`*40001\\GE*1*300000001\\IEA*1*200000001\\`);
  return text;
}

export function from855() {}
