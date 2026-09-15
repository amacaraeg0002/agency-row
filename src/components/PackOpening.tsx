import { useState } from "react";
import { ArrowRight, PackageOpen, Sparkles } from "lucide-react";
import { CARDS, PACKS, RARITIES } from "../cardData";
import { canSell, money, quicksellValue } from "../economy";
import { useGameStore } from "../useGameStore";
import type { CardId, PackId } from "../types";
import { CardDisplay } from "./CardDisplay";
import { Modal } from "./Modal";

export function PackOpening() {
  const game = useGameStore((state) => state.game);
  const buy = useGameStore((state) => state.buyPack);
  const reveal = useGameStore((state) => state.reveal);
  const finish = useGameStore((state) => state.finishPack);
  const sell = useGameStore((state) => state.sell);
  const [walkout, setWalkout] = useState<CardId | null>(null);
  const pending = game.pendingPack;

  const flip = (index: number) => {
    const id = reveal(index);
    if (id && RARITIES.indexOf(CARDS[id].rarity) >= 4) setWalkout(id);
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow">THE NEXT FRANCHISE PLAYER IS IN HERE.</p>
        <h1 className="page-title">Pack Ripping Vault</h1>
      </div>

      {!pending ? (
        <div className="grid gap-6 md:grid-cols-2">
          {(Object.keys(PACKS) as PackId[]).map((kind) => {
            const pack = PACKS[kind];
            return (
              <section key={kind} className="panel p-6 sm:p-8">
                <h2 className="text-xl font-black">{pack.name}</h2>
                <p className="mt-2 text-sm text-slate-400">{pack.description}</p>
                <button className="primary-button mt-6 w-full justify-between" disabled={game.cash < pack.price} onClick={() => buy(kind)}>
                  <span className="flex items-center gap-2"><PackageOpen size={18} /> Rip pack</span>
                  <span>{money(pack.price)}</span>
                </button>
              </section>
            );
          })}
        </div>
      ) : (
        <section className="panel p-5 sm:p-8">
          <div className="grid justify-center gap-7 sm:grid-cols-3">
            {pending.cards.map((pulled, index) => {
              const card = CARDS[pulled.cardId];
              return (
                <div key={index} className="mx-auto w-full max-w-64">
                  <button onClick={() => flip(index)} disabled={pulled.revealed} className="w-full text-left">
                    {!pulled.revealed ? (
                      <div className="aspect-[3/4.4] flex items-center justify-center rounded-2xl bg-slate-800 border"><Sparkles size={35} /></div>
                    ) : (
                      <CardDisplay card={card} owned={game.inventory[pulled.cardId]} />
                    )}
                  </button>
                  {pulled.revealed && pulled.duplicate && (
                    <button className="secondary-button mt-3 w-full" disabled={!canSell(game, pulled.cardId)} onClick={() => sell(pulled.cardId)}>Sell · {money(quicksellValue(card))}</button>
                  )}
                </div>
              );
            })}
          </div>
          <button onClick={finish} disabled={!pending.cards.every((c) => c.revealed)} className="primary-button mx-auto mt-8 block w-full text-center">Finish opening</button>
        </section>
      )}

      {walkout && (
        <Modal title={`${CARDS[walkout].rarity.toUpperCase()} WALKOUT`} onClose={() => setWalkout(null)}>
          <div className="mx-auto w-64 mt-4"><CardDisplay card={CARDS[walkout]} owned={game.inventory[walkout]} /></div>
          <button onClick={() => setWalkout(null)} className="primary-button mx-auto mt-8 w-full justify-center">Welcome</button>
        </Modal>
      )}
    </div>
  );
}
