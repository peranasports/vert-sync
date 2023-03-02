export function initWithJumpObjects(objs)
{
    var self = {
        set:null,
        match:null,
        player:null,
        spikeJumpTotal:0,
        spikeJumpKillTotal:0,
        spikeJumpErrorTotal:0,
        spikeJumpBlockedTotal:0,
        spikeCountTotal:0,
        spikeCountKillTotal:0,
        spikeCountErrorTotal:0,
        spikeCountBlockedTotal:0,
        spikeJumpMaximum:0,
        spikeJumpStandardDeviation:0,
        spikeJumpAverage:0,
        spikeJumpKillAverage:0,
        spikeJumpErrorAverage:0,
        spikeJumpBlockedAverage:0,
        spikeEfficiency:0,
        blockJumpTotal:0,
        blockJumpKillTotal:0,
        blockJumpMaximum:0,
        blockCountTotal:0,
        blockCountKillTotal:0,
        blockJumpAverage:0,
        blockJumpStandardDeviation:0,
        blockJumpKillAverage:0,
        serveJumpTotal:0,
        serveJumpKillTotal:0,
        serveJumpErrorTotal:0,
        serveJumpMaximum:0,
        serveCountTotal:0,
        serveCountKillTotal:0,
        serveCountErrorTotal:0,
        serveJumpAverage:0,
        serveJumpStandardDeviation:0,
        serveJumpKillAverage:0,
        serveJumpErrorAverage:0,
        setJumpTotal:0,
        setJumpMaximum:0,
        setJumpCountTotal:0,
        setCountTotal:0,
        setJumpAverage:0,
        setJumpStandardDeviation:0,
        allJumpMax:0,
        allJumpTotal:0,
        allJumpCountTotal:0,
        allLandingPeakGSTotal:0,
        allLandingStressTotal:0,
        allLandingCountTotal:0,
        allJumpAverage:0,
        allLandingPeakGSAverage:0,
        allLandingStressAverage:0,
        allJumpActionMax:0,
        allJumpActionTotal:0,
        allJumpActionCountTotal:0,
        allJumpActionAverage:0,
        allJumpNonActionMax:0,
        allJumpNonActionTotal:0,
        allJumpNonActionCountTotal:0,
        allJumpNonActionAverage:0,
        }
    var aspikes = [];
    var ablocks = [];
    var aserves = [];
    var asets = [];
    var jumpUnit = 0;
    self.allJumpMax = 0;
    self.allJumpActionMax = 0;
    var setjump = jumpUnit === 0 ? 4 : 4 * 2.54;
//    for (Jump *obj in objs)
    for (var no=0; no<objs.length; no++)
    {
        var viobj = objs[no]
        var vertinches = jumpUnit == 0 ? viobj.vertinches : viobj.vertcms;
        self.allJumpMax = vertinches > self.allJumpMax ? vertinches : self.allJumpMax;
        self.allJumpTotal += vertinches;
        self.allJumpCountTotal++;
        if (viobj.landingpeakgs !== undefined && viobj.landingstress !== undefined)
        {
            self.allLandingStressTotal += viobj.landingstress;
            self.allLandingPeakGSTotal += viobj.landingpeakgs;
            self.allLandingCountTotal++;
        }
        var obj = viobj;
        if (obj == null)
        {
            continue;
        }
        if (obj.event != null)
        {
            self.allJumpActionCountTotal++;
            self.allJumpActionTotal += vertinches;
            self.allJumpActionMax = vertinches > self.allJumpActionMax ? vertinches : self.allJumpActionMax;
            var grade = obj.event.DVGrade;
            if (obj.event.EventType === 4)
            {
                aspikes.push(vertinches);
                self.spikeJumpMaximum = vertinches > self.spikeJumpMaximum ? vertinches : self.spikeJumpMaximum;
                self.spikeCountTotal++;
                self.spikeJumpTotal += vertinches;
                if (grade === "#")
                {
                    self.spikeCountKillTotal++;
                    self.spikeJumpKillTotal += vertinches;
                }
                else if (grade === "=")
                {
                    self.spikeCountErrorTotal++;
                    self.spikeJumpErrorTotal += vertinches;
                }
                else if (grade === "/")
                {
                    self.spikeCountBlockedTotal++;
                    self.spikeJumpBlockedTotal += vertinches;
                }
            }
            else if (obj.event.EventType === 5)
            {
                ablocks.push(vertinches);
                self.blockJumpMaximum = vertinches > self.blockJumpMaximum ? vertinches : self.blockJumpMaximum;
                self.blockCountTotal++;
                self.blockJumpTotal += vertinches;
                if (grade === "#")
                {
                    self.blockCountKillTotal++;
                    self.blockJumpKillTotal += vertinches;
                }
            }
            else if (obj.event.EventType === 1)
            {
                aserves.push(vertinches);
                self.serveJumpMaximum = vertinches > self.serveJumpMaximum ? vertinches : self.serveJumpMaximum;
                self.serveCountTotal++;
                self.serveJumpTotal += vertinches;
                if (grade === "#")
                {
                    self.serveCountKillTotal++;
                    self.serveJumpKillTotal += vertinches;
                }
                else if (grade === "=")
                {
                    self.serveCountErrorTotal++;
                    self.serveJumpErrorTotal += vertinches;
                }
            }
            else if (obj.event.EventType === 3 || obj.event.EventType === 20)
            {
                if (vertinches > setjump)
                {
                    asets.push(vertinches);
                    self.setJumpCountTotal++;
                }
                self.setJumpMaximum = vertinches > self.setJumpMaximum ? vertinches : self.setJumpMaximum;
// count separately
//                setCountTotal++;
                self.setJumpTotal += vertinches;
            }
        }
        else
        {
            self.allJumpNonActionCountTotal++;
            self.allJumpNonActionTotal += vertinches;
            self.allJumpNonActionMax = vertinches > self.allJumpNonActionMax ? vertinches : self.allJumpNonActionMax;
        }
    }
    self.spikeJumpStandardDeviation = aspikes.count == 0 ? 0 : aspikes.standardDeviation
    self.setJumpStandardDeviation = asets.count == 0 ? 0 : asets.standardDeviation
    self.blockJumpStandardDeviation = ablocks.count == 0 ? 0 : ablocks.standardDeviation
    self.serveJumpStandardDeviation = aserves.count == 0 ? 0 : aserves.standardDeviation
    return self
}
