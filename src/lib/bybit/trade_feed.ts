
export const   let json: Payload = JSON.parse(message.data);
match(json)
  .with({ data: P.array({ S: P.string }) }, () => {
    (json as Trades).data.forEach((i) => {
      i.type = c.type; // inverse has usd dom.
      if (i.type == 'inverse') {
        if (+i.v > options.min_size) {
          //
          data_feed = push_front(data_feed, i);
        }
      } else {
        if (i.v * i.p > options.min_size) {
          data_feed = push_front(data_feed, i);
        }
      }
    });
  })
  .with({ success: P.boolean }, () => {})
  .run();
};