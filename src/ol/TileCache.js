/**
 * @module ol/TileCache
 */
import LRUCache from './structs/LRUCache.js';
import {fromKey, getKey} from './tilecoord.js';

class TileCache extends LRUCache {

  /**
   * @param {number=} opt_highWaterMark High water mark.
   */
  constructor(opt_highWaterMark) {

    super(opt_highWaterMark);

  }

  /**
   * @param {!Object.<string, module:ol/TileRange>} usedTiles Used tiles.
   */
  expireCache(usedTiles) {
    while (this.canExpireCache()) {
      const tile = this.peekLast();
      const zKey = tile.tileCoord[0].toString();
      if (zKey in usedTiles && usedTiles[zKey].contains(tile.tileCoord)) {
        break;
      } else {
        this.pop().dispose();
      }
    }
  }

  /**
   * Prune all tiles from the cache that don't have the same z as the newest tile.
   */
  pruneExceptNewestZ() {
    if (this.getCount() === 0) {
      return;
    }
    const key = this.peekFirstKey();
    const tileCoord = fromKey(key);
    const z = tileCoord[0];
    this.forEach(function(tile) {
      if (tile.tileCoord[0] !== z) {
        this.remove(getKey(tile.tileCoord));
        tile.dispose();
      }
    }, this);
  }
}


export default TileCache;
