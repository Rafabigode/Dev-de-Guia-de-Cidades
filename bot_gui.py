
import asyncio
import time
import tkinter as tk
from twitchio.ext import commands

CHANNELS = [
    "casalxgamer", "mathz_vlr", "djzexy", "donpv93", "klampton", "loqapple",
    "srochoa07", "magosp1010", "retleygm", "geofordok", "dnlclark",
    "kayn_ofc", "diiogofalcao", "darcherman", "anyelo992", "kinglacostado",
    "xlolz3r", "lsalixl", "lostsh0t"
]

SEU_NICK = "vi1andr3x_"
SEU_USER_ID = "1393403082"

CLIENT_ID = "y6re82glsafhigbvvx6gigmnoisfqi"
CLIENT_SECRET = "gg8g7zk371m9gsbuwy0z8bdd6sxris"

TOKEN = "oauth:jxkan9261tzbjqwh2qo3jroqb9sqyl"

class SorteioBot(commands.Bot):
    def __init__(self):
        super().__init__(
            token=TOKEN,
            client_id=CLIENT_ID,
            client_secret=CLIENT_SECRET,
            bot_id=SEU_USER_ID,
            prefix="!",
            initial_channels=CHANNELS
        )

        self.detectados = {}
        self.ultimo_envio = {}
        self.comando_identificado = {}

    async def event_ready(self):
        print("BOT ONLINE")

    async def event_message(self, message):
        if message.echo:
            return

        canal = message.channel.name
        conteudo = message.content.lower()
        autor = message.author.name.lower()

        if autor != SEU_NICK.lower() and conteudo.startswith("!"):
            cmd = conteudo.split(" ")[0]

            if canal not in self.detectados:
                self.detectados[canal] = {}

            if cmd not in self.detectados[canal]:
                self.detectados[canal][cmd] = {"usuarios": set(), "ultimo": time.time()}

            registro = self.detectados[canal][cmd]
            registro["usuarios"].add(autor)
            registro["ultimo"] = time.time()

            if len(registro["usuarios"]) >= 3 and canal not in self.comando_identificado:
                self.comando_identificado[canal] = cmd

                await message.channel.send(cmd)

                self.ultimo_envio[canal] = time.time()

        if message.author.name.lower() == "nightbot":
            if SEU_NICK.lower() in conteudo:
                if (time.time() - self.ultimo_envio.get(canal, 0)) > 5:
                    await message.channel.send(SEU_NICK)
                    self.ultimo_envio[canal] = time.time()

        await self.handle_commands(message)


def iniciar_bot():
    bot = SorteioBot()

    async def run():
        await bot.start()

    asyncio.run(run())


root = tk.Tk()
root.title("Bot de Sorteios Automático")

tk.Label(root, text="BOT PRONTO — CLIQUE INICIAR").pack()

tk.Button(root, text="INICIAR BOT", command=iniciar_bot).pack()

root.mainloop()
