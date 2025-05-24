import React from 'react';
import { HexGrid, Layout, Hexagon, Text, Pattern, Path, Hex } from 'react-hexgrid';
import { useBoard } from '../state/boardStore';

export default function HexBoard() {
  const { tiles } = useBoard();
  
  // Generate hex coordinates for a 37-tile board (roughly circular)
  const hexagons = [];
  let tileIndex = 0;
  
  // Create a spiral pattern of hexagons
  for (let q = -3; q <= 3; q++) {
    for (let r = Math.max(-3, -q - 3); r <= Math.min(3, -q + 3); r++) {
      if (tileIndex < tiles.length) {
        hexagons.push({
          q,
          r,
          s: -q - r,
          tile: tiles[tileIndex],
          index: tileIndex
        });
        tileIndex++;
      }
    }
  }

  return (
    <div className="hex-board-container">
      <HexGrid width={800} height={600} viewBox="-50 -50 100 100">
        <Layout size={{ x: 6, y: 6 }} flat={true} spacing={1.1} origin={{ x: 0, y: 0 }}>
          {hexagons.map((hex) => (
            <Hexagon
              key={`${hex.q}-${hex.r}-${hex.s}`}
              q={hex.q}
              r={hex.r}
              s={hex.s}
              fill={hex.tile === 'empty' ? '#001219' : '#0a9396'}
              stroke="#94d2bd"
              strokeWidth={0.2}
            >
              <Text>{hex.index}</Text>
            </Hexagon>
          ))}
        </Layout>
      </HexGrid>
    </div>
  );
} 