export function startLooping(
  updateIntervalInSeconds: number,
  callback: () => void,
) {
  const blob = new Blob(
    [
      /* javascript */ `
			// the initial timeout time
			let timeoutTime =  ${(updateIntervalInSeconds * 1000).toFixed(1)};
			// onmessage callback
            self.onmessage = function(msg){
              timeoutTime = parseInt(msg.data);
            };
			// the tick function which posts a message
			// and schedules a new tick
			function tick(){
				setTimeout(tick, timeoutTime);
				self.postMessage('tick');
			}
			// call tick initially
			tick();
			`,
    ],
    { type: "text/javascript" },
  );
  const blobUrl = URL.createObjectURL(blob);
  const worker = new Worker(blobUrl);

  worker.onmessage = callback;

  return (updateIntervalInSeconds: number): void => {
    worker.postMessage(updateIntervalInSeconds * 1000);
  };
}
