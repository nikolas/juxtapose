import {
    collisionPresent, constrainEndTimeToAvailableSpace,
    elementsCollide, formatTimecode, pad2,
    getSeparatedTimeUnits
} from '../src/utils.js';

describe('collisionPresent', () => {
    it('handles an empty track', () => {
        expect(collisionPresent([], 30, 1, 2)).toBe(false);
        expect(collisionPresent([], 30, 0, 2)).toBe(false);
        expect(collisionPresent([], 30, 0, 99)).toBe(true);
    });
    it('correctly detects collisions', () => {
        expect(collisionPresent([{
            start_time: 0.22,
            end_time: 0.66
        }], 30, 0, 0.23)).toBe(true);

        expect(collisionPresent([{
            start_time: 0.22,
            end_time: 0.66
        }], 30, 0.78, 1)).toBe(false);

        expect(collisionPresent([
            {
                start_time: 0.22,
                end_time: 0.66
            },
            {
                start_time: 0.68,
                end_time: 1
            },
            {
                start_time: 1.2,
                end_time: 11
            }
        ], 30, 0.78, 1)).toBe(true);

        expect(collisionPresent([
            {
                start_time: 0.22,
                end_time: 0.66
            },
            {
                start_time: 0.68,
                end_time: 1
            },
            {
                start_time: 1.2,
                end_time: 11
            }
        ], 30, 1.1, 1.15)).toBe(false);
    });
});

describe('constrainEndTimeToAvailableSpace', () => {
    it('handles empty track data', () => {
        expect(
            constrainEndTimeToAvailableSpace(0.22, 0.66, 10, [])
        ).toBe(0.66);
        expect(
            constrainEndTimeToAvailableSpace(0.22, 11, 10, [])
        ).toBe(10);
        expect(
            constrainEndTimeToAvailableSpace(5, 9, 10, [])
        ).toBe(9);
    });
    it('correctly detects collisions', () => {
        let track = [{
            start_time: 0,
            end_time: 0.23
        }];
        expect(
            constrainEndTimeToAvailableSpace(0.22, 0.66, 10, track)
        ).toBe(0);

        track = [{
            start_time: 0.5,
            end_time: 5
        }];
        expect(
            constrainEndTimeToAvailableSpace(0.22, 0.66, 10, track)
        ).toBe(0.5);

        track = [
            {
                start_time: 0.5,
                end_time: 5
            }, {
                start_time: 6,
                end_time: 8
            }
        ];
        expect(
            constrainEndTimeToAvailableSpace(5.5, 88, 10, track)
        ).toBe(6);
        expect(
            constrainEndTimeToAvailableSpace(5.1, 6, 10, track)
        ).toBe(6);
    });
});

describe('elementsCollide', () => {
    it('correctly detects collisions', () => {
        let e1 = {
            start_time: 0.22,
            end_time: 0.66
        };
        let e2 = {
            start_time: 0,
            end_time: 0.23
        };
        expect(elementsCollide(e1, e2)).toBe(true);
        expect(elementsCollide(e2, e1)).toBe(true);

        e1 = {
            start_time: 0.22,
            end_time: 0.66
        };
        e2 = {
            start_time: 0.5,
            end_time: 0.6
        };
        expect(elementsCollide(e1, e2)).toBe(true);
        expect(elementsCollide(e2, e1)).toBe(true);

        e1 = {
            start_time: 0.22,
            end_time: 0.66
        };
        e2 = {
            start_time: 0.5,
            end_time: 1
        };
        expect(elementsCollide(e1, e2)).toBe(true);
        expect(elementsCollide(e2, e1)).toBe(true);

        e1 = {
            start_time: 0.22,
            end_time: 0.66
        };
        e2 = {
            start_time: 0,
            end_time: 0.2
        };
        expect(elementsCollide(e1, e2)).toBe(false);
        expect(elementsCollide(e2, e1)).toBe(false);
    });
});

describe('formatTimecode', () => {
    it('formats seconds correctly', () => {
        expect(formatTimecode(0)).toBe('00:00:00');
        expect(formatTimecode(55)).toBe('00:55:00');
        expect(formatTimecode(60)).toBe('01:00:00');
        expect(formatTimecode(81)).toBe('01:21:00');
        expect(formatTimecode(9999)).toBe('166:39:00');
    });
    it('formats centiseconds correctly', () => {
        expect(formatTimecode(0.2398572)).toBe('00:00:24');
        expect(formatTimecode(55.1871)).toBe('00:55:19');
        expect(formatTimecode(60.1241)).toBe('01:00:12');
        expect(formatTimecode(81.3299)).toBe('01:21:33');
        expect(formatTimecode(9999.114)).toBe('166:39:11');
    });
});

describe('getSeparatedTimeUnits', () => {
    it('returns the correct values', () => {
        expect(getSeparatedTimeUnits(0)).toEqual([0, 0, 0]);
        expect(getSeparatedTimeUnits(0.01)).toEqual([0, 0, 1]);
        expect(getSeparatedTimeUnits(110.01)).toEqual([1, 50, 1]);
    });
});

describe('pad2', () => {
    it('pads a low number with a zero', () => {
        expect(pad2(0)).toBe('00');
        expect(pad2(4)).toBe('04');
    });
    it('doesn\'t pad high numbers', () => {
        expect(pad2(10)).toBe('10');
        expect(pad2(99)).toBe('99');
        expect(pad2(100)).toBe('100');
    });
});
