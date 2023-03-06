export function initWithXMLData(xmlData)
{
    var XMLParser = require('react-xml-parser');
    var xml = new XMLParser().parseFromString(xmlData);
    // console.log(xml);

    var a = [];
    var pnames = [];
    var starttime;
    const sessioninfos = xml.getElementsByTagName("SESSION_INFO");
    if (sessioninfos.length == 1)
    {
        const xsessioninfo = sessioninfos[0];
        const starttimes = xsessioninfo.getElementsByTagName("start_time");
        if (starttimes.length == 1)
        {
            const xstarttime = starttimes[0];
            starttime = xstarttime.value;
        }
    }
    const allinstances = xml.getElementsByTagName("ALL_INSTANCES");
    if (allinstances.length == 1)
    {
        var firsttime = 0;
        const xallinstance = allinstances[0];
        const instances = xallinstance.getElementsByTagName("instance");
        for (var ni=0; ni<instances.length; ni++)
        {
            const instance = instances[ni]
            var vio = {}
            a.push(vio)
            var starttime;
            var endtime;
            const ids = instance.getElementsByTagName("ID");
            if (ids.length > 0)
            {
                const xid = ids[0];
                vio.instanceid = xid.value;
            } else continue;
            const codes = instance.getElementsByTagName("code");
            if (codes.length > 0)
            {
                const xcode = codes[0];
                vio.playerName = xcode.value;
                if (pnames.includes(xcode.value) === false)
                {
                    pnames.push(xcode.value)
                }
            } else continue;
            const starts = instance.getElementsByTagName("start");
            if (starts.length > 0)
            {
                const xstart = starts[0];
                starttime = xstart.value;
                if (firsttime == 0 || starttime < firsttime)
                {
                    firsttime = starttime;
                }
                vio.timesince1970 = starttime;
                vio.timesecs = starttime - firsttime;
                vio.timeStamp = new Date(starttime * 1000);
            } else continue;
            const ends = instance.getElementsByTagName("end");
            if (ends.length > 0)
            {
                const xend = ends[0];
                endtime = xend.value;
            } else continue;
            const labels = instance.getElementsByTagName("label");
            if (labels.length > 0)
            {
                for (var nl=0; nl<labels.length; nl++)
                {
                    const label = labels[nl]
                    var gname = null;
                    var text = null;
                    const groups = label.getElementsByTagName("group");
                    if (groups.length > 0)
                    {
                        const x = groups[0];
                        gname = x.value;
                    }
                    const texts = label.getElementsByTagName("text");
                    if (texts.length > 0)
                    {
                        const x = texts[0];
                        text = x.value;
                    }
                    if (gname === "VERT Height Inches")
                    {
                        const val = Number.parseFloat(text)
                        vio.vertinches = val;
                        vio.vertcms = val * 2.54
                    }
                    else if (gname === "VERT Height cm")
                    {
                        const val = Number.parseFloat(text)
                        vio.vertcms = val
                        vio.vertinches = val / 2.54;
                    }
                    else if (gname === "VERT Ht Range")
                    {
                        vio.vertrange = text;
                    }
                    else if (gname === "VERT % Max Height")
                    {
                        vio.vertmaxheightpc = Number.parseFloat(text);
                    }
                    else if (gname === "VERT % Max Ht Range")
                    {
                        vio.vertmaxheightrange = text;
                    }
                    else if (gname === "VERT Landing Stress")
                    {
                        vio.landingstress = Number.parseFloat(text);
                    }
                    else if (gname === "VERT Land Stress Range")
                    {
                        vio.landingstressrange = text;
                    }
                    else if (gname === "VERT Landing Peak Gs")
                    {
                        vio.landingpeakgs = Number.parseFloat(text);
                    }
                    else if (gname === "VERT Land Peak Gs Range")
                    {
                        vio.landingpeakgsrange = text;
                    }
                }
            } else continue;
        }
    }

    var objs = []
    for (var np=0; np<pnames.length; np++)
    {
        const pname = pnames[np]
        var vobj = {playerName: pname, jumps: []}
        for (var na=0; na<a.length; na++)
        {
            const vio = a[na]
            if (vio.playerName === pname)
            {
                vobj.jumps.push(vio)
            }
        }
        objs.push(vobj)
    }
    // console.log(objs)
    return objs

    /*
    NSString *vertfile = [NSString stringWithFormat:@"%@/%@", DOCSFOLDER, path.lastPathComponent];
    self.match = m;
    self.team = tm;
    NSMutableDictionary *dic = [[NSMutableDictionary alloc] init];
    ISO8601DateFormatter *isodf = [[ISO8601DateFormatter alloc] init];
    isodf.useMillisecondPrecision = YES;
    isodf.includeTime = YES;
    maxjump = 0;
    maxlandingstress = 0;
    maxlandinggs = 0;
    for (var n=0; n<a.length; n++)
    {
        VertItemObject *vio = a[n];
        {
            NSString *pname = vio.playerName;
            VertPlayerObject *vpo = [dic valueForKey:pname];
            if (vpo == nil)
            {
                vpo = [[VertPlayerObject alloc] init];
                vpo.vertFile = self;
                vpo.playerName = pname;
                vpo.player = [self.team playerFromVertName:pname]; // //[dic2 valueForKey:pname];
                vpo.match = self.match;
                vpo.team = self.team;
                vpo.jumps = [[NSMutableArray alloc] init];
                [dic setValue:vpo forKey:pname];
            }
            [vpo.jumps addObject:vio];
            maxjump = vio.vertcms > maxjump ? vio.vertcms : maxjump;
            maxlandingstress = vio.landingstress > maxlandingstress ? vio.landingstress : maxlandingstress;
            maxlandinggs = vio.landingpeakgs > maxlandinggs ? vio.landingpeakgs : maxlandinggs;
        }
    }
    
    NSMutableDictionary *jdic = [[NSMutableDictionary alloc] init];
    for (NSString *key in dic.allKeys)
    {
        VertPlayerObject *obj = [dic objectForKey:key];
        NSSortDescriptor *sd = [[NSSortDescriptor alloc] initWithKey:@"timesecs" ascending:YES];
        [obj.jumps sortUsingDescriptors:@[sd]];
        const alljumps = [NSArray arrayWithArray:obj.jumps];
        [jdic setValue:alljumps forKey:key];
    }
    self.dicPlayerObjects = [NSDictionary dictionaryWithDictionary:dic];
    self.dicAllJumps = [NSDictionary dictionaryWithDictionary:jdic];
    
    if (self.match.vertOffset != nil)
    {
        double offset = [self.match.vertOffset doubleValue];
        if (offset != 0)
        {
            [self adjustTime:-offset];
            [self doMatchEventsToJumps];
        }
    }
//    [self findBestFitJumpTimes];
//    [self doMatchEventsToJumps];

    // try match team
    var homematches = 0;
    const pls = [XAppDelegate fetchPlayersInTeam:self.match.Team sortedBy:@"LastName");
    for (NSString *key in self.dicPlayerObjects.allKeys)
    {
        VertPlayerObject *obj = [self.dicPlayerObjects valueForKey:key];
        for (Player *pl in pls)
        {
            const tokens = [obj.playerName componentsSeparatedByString:@" ");
            var matches = 0;
            for (NSString *token in tokens)
            {
                if (token.length > 1 && [token containsString:@"."] != YES && [[pl.FullName uppercaseString] containsString:[token uppercaseString]])
                {
                    matches++;
                }
            }
            if (matches > 0)
            {
                homematches++;
                break;
            }
        }
    }
    var awaymatches = 0;
    pls = [XAppDelegate fetchPlayersInTeam:self.match.Opposition sortedBy:@"LastName");
    for (NSString *key in self.dicPlayerObjects.allKeys)
    {
        VertPlayerObject *obj = [self.dicPlayerObjects valueForKey:key];
        for (Player *pl in pls)
        {
            const tokens = [obj.playerName componentsSeparatedByString:@" ");
            var matches = 0;
            for (NSString *token in tokens)
            {
                if (token.length > 1 && [token containsString:@"."] != YES && [[pl.FullName uppercaseString] containsString:[token uppercaseString]])
                {
                    matches++;
                }
            }
            if (matches > 0)
            {
                awaymatches++;
                break;
            }
        }
    }
    self.team = homematches > awaymatches ? self.match.Team : self.match.Opposition;
    */
}

export function synchJumpsAndStats(vertObjects, match)
{
    for (var nv=0; nv<vertObjects.length; nv++)
    {
        var vobj = vertObjects[nv]
        if (vobj.selectPlayer === undefined) continue;
        vobj.jumpevents = []
        vobj.events = []
        for (var ne=0; ne<match.events.length; ne++)
        {
            var e = match.events[ne]
            if (e.Player.FirstName === vobj.selectPlayer.FirstName && e.Player.LastName === vobj.selectPlayer.LastName)
            {
                vobj.events.push(e)
                if (e.EventType === 4 || e.EventType === 5 || e.EventType === 1  || e.EventType === 3  || e.EventType === 20)
                {
                    vobj.jumpevents.push(e)
                }
            }
        }
    }

    // const starteventtime = vo.jumpevents[0].TimeStamp.getTime() /1000
    // for (var ne=0; ne<vo.jumpevents.length; ne++)
    // {
    //     var ev = vo.jumpevents[ne]
    //     ev.offsettime = ev.TimeStamp.getTime()/1000 - starteventtime
    // }

    const tolerance = 4
    for (var nv=0; nv<vertObjects.length; nv++)
    {
        var vpo = vertObjects[nv]
        var times = bestFitTimesForPlayer(vpo, tolerance)
    }
}

function bestFitTimesForPlayer(vpo, threshold)
{
    var times = [];
    var spikeEvents = vpo.jumpevents;
    if (spikeEvents === undefined || spikeEvents.length == 0)
    {
        return [];
    }
    var vertjumps = vpo.jumps
    
    var maxmax = 0;
    var bestthreshold = 0;
    var maxstarttime = 0;

    const firstEvent = spikeEvents[0];
    const firstTimestamp = firstEvent.TimeStamp;
    const firstEventTime = firstTimestamp.getTime() / 1000;

    for (var allowance = 1; allowance<15; allowance++)
    {
        var startjump = 0;
        var count = 0;
        var starttime = 0;
        var maxcount = 0;
        var maxstartjump = 0;
        maxstarttime = 0;
        do
        {
            for (var nv=0; nv<vertjumps.length; nv++)
            {
                var vio = vertjumps[nv]
                vio.event = null;
            }
            var vio = vertjumps[startjump];
            vio.event = firstEvent;
            starttime = vio.timesecs;
            var nextjump = startjump + 1;
            count = 1;

            var vio = vertjumps[startjump];
            vio.event = spikeEvents[0];
            spikeEvents[0].vertData = {timesecs:vio.timesecs, 
                vertinches:vio.vertinches, 
                vertrange:vio.vertrange, 
                vertmaxheight:vio.vertmaxheightrange, 
                vertmaxheightpc:vio.vertmaxheightpc, 
                landingpeakgs:vio.landingpeakgs, 
                landingpeakgsrange:vio.landingpeakgsrange, 
                landingstress:vio.landingstress, 
                landingstressrange:vio.landingstressrange};

            for (var n=1; n<spikeEvents.length; n++)
            {
                var e = spikeEvents[n];
                const eventTime = e.TimeStamp.getTime()/1000;
                for (var j=nextjump; j<vertjumps.length; j++)
                {
                    var vio = vertjumps[j];
                    const tijump = firstEventTime + (vio.timesecs - starttime);
                    if (vio.event == null && eventTime <= tijump + allowance && eventTime >= tijump - allowance)
                    {
                        count++;
                        vio.event = e;
                        e.vertData = {timesecs:vio.timesecs, 
                            vertinches:vio.vertinches, 
                            vertrange:vio.vertrange, 
                            vertmaxheight:vio.vertmaxheightrange, 
                            vertmaxheightpc:vio.vertmaxheightpc, 
                            landingpeakgs:vio.landingpeakgs, 
                            landingpeakgsrange:vio.landingpeakgsrange, 
                            landingstress:vio.landingstress, 
                            landingstressrange:vio.landingstressrange};
                        nextjump = j;
                        break;
                    }
                }
            }

            // if found all then piss off
            if (count == spikeEvents.length)
            {
                const jumpstartdatetime = new Date(firstEvent.TimeStamp.getTime() - starttime * 1000);
                vpo.vertStartTime = jumpstartdatetime;
                vpo.threshold = threshold;
                // NSLog(@"jumpstartdatetime = %@", jumpstartdatetime);
                times.push(jumpstartdatetime);
                return times;
            }
            if (count > maxcount)
            {
                maxcount = count;
                maxstartjump = startjump;
                maxstarttime = starttime;
            }
            // NSLog(@"events = %d, startjump = %d, count = %d, event time = %@, jump timesec = %f", (int)spikeEvents.length, startjump, count, firstEvent.TimeStamp, vio.timesecs);
            startjump++;
        } while (startjump < vertjumps.length /*&& count != spikeEvents.length*/);
        // NSLog(@"Allow = %d - maxcount = %d / %d %d %@", allowance, maxcount, (int)spikeEvents.length, maxstarttime, vpo.player.FullName);
        
        if (maxcount > maxmax)
        {
            maxmax = maxcount;
            bestthreshold = allowance;
        }
    }
//    NSLog(@"events = %d, count = %d", (int)spikeEvents.length, count);
    doBestFitTimesForPlayer(spikeEvents, vertjumps, bestthreshold, maxmax);
    var nn = 0;
    for (var vj=0; vj<vertjumps.length; vj++)
    {
        var vio = vertjumps[vj]
        if (vio.event != null)
        {
            const dt = new Date(vio.event.TimeStamp.getTime() - vio.timesecs * 1000);
            // NSLog(@"%02d %f %@", nn++, vio.timesecs, vio.event.EventDescription);
        }
    }
    const jumpstartdatetime = new Date(firstEvent.TimeStamp.getTime() - maxstarttime * 1000);
    vpo.vertStartTime = jumpstartdatetime;
    vpo.threshold = threshold;
//    NSLog(@"max = %d/%d jumpstartdatetime = %@", maxcount, (int)spikeEvents.length, jumpstartdatetime);
    times.push(jumpstartdatetime);
    return times;
}

function doBestFitTimesForPlayer(spikeEvents, vertjumps, allowance, max)
{
    const firstEvent = spikeEvents[0];
    const firstTimestamp = firstEvent.TimeStamp;
    const firstEventTime = firstTimestamp.getTime() / 1000;

    var startjump = 0;
    var count = 0;
    var starttime = 0;
    var maxcount = 0;
    var maxstartjump = 0;
    var maxstarttime = 0;
    do
    {
        for (var vj=0; vj<vertjumps.length; vj++)
        {
            var vio = vertjumps[vj]
            vio.event = null;
        }
//        NSLog(@"Clear all events");
        var vio = vertjumps[startjump];
        vio.event = firstEvent;
        starttime = vio.timesecs;
        var nextjump = startjump + 1;
        count = 1;
        for (var n=1; n<spikeEvents.length; n++)
        {
            var e = spikeEvents[n];
            const eventTime = e.TimeStamp.getTime() / 1000;
            for (var j=nextjump; j<vertjumps.length; j++)
            {
                var vio = vertjumps[j];
                const tijump = firstEventTime + (vio.timesecs - starttime);
                if (vio.event == null && eventTime <= tijump + allowance && eventTime >= tijump - allowance)
                {
                    count++;
                    vio.event = e;
                    // NSLog(@"%02d Assign event %f %@", count, vio.timesecs, vio.event.EventDescription);
                    e.vertData = {timesecs:vio.timesecs, 
                        vertinches:vio.vertinches, 
                        vertrange:vio.vertrange, 
                        vertmaxheight:vio.vertmaxheightrange, 
                        vertmaxheightpc:vio.vertmaxheightpc, 
                        landingpeakgs:vio.landingpeakgs, 
                        landingpeakgsrange:vio.landingpeakgsrange, 
                        landingstress:vio.landingstress, 
                        landingstressrange:vio.landingstressrange};
                nextjump = j;
                    break;
                }
            }
        }

        if (count == max)
        {
            return;
        }
        if (count > maxcount)
        {
            maxcount = count;
            maxstartjump = startjump;
            maxstarttime = starttime;
        }
        startjump++;
    } while (startjump < vertjumps.length /*&& count != spikeEvents.length*/);
}

