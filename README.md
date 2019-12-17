# BackEnd
To start the webserver, inside the projekt folder open a terminal and run: "npm run dev" without the " " citation marks.


# Dokumentera Händelser
:coffee: :pizza: :pizza: :coffee: :smiley: 

2019/12/16: Ändrat validation token till ett 6 siffrigt tal. Validering funkar nu.

2019/12/15: Lagt till login system och "Validation token" och "Active" status på user database. Validation token ska användas för att verifiera användarens email. Token skickas till användarens email och när han sedan följer länken så kommer hans "Active" status att ändras till true så att personen kan logga in.

2019/12/14: Lagt till grunden med mera. Config, databas connection och registernings system.

Dokumentation saker som ska göras::

#CHANGE THE EMAIL VERIFCATION JUST TO SIMPLE NUMBERS, 
#YOU DONT NEED TO GENERATE A CRAZY LONG STRING
#JUST A NUMBER LIKE 5436, EVEN IF SOMEONE ELSE HAS IT,
#IT WONT MATTER BECAUSE YOU CANT GUESS IT ANYWAYS.

```diff
# Saker som ska implementeras!
- Saker som är klara men problem finns!
+ Saker som är klara och implementerade!

+ #EXEMPEL: Login system  (Grönt markerat för det är klart!)
# Always kill a proccess after it's done retriving data. Like when you retrieve a chat, you dont have to keep the connection up. You re-establish when needed.
+ DONE Check that the same email doesn't get registerd just because one has uppercase and the other one lowercase, same goes for username
# Open source AI som förbjuder pornografiskt innehåll från att laddas upp.
# Open source AI som detekterar objektet på kameran, tex om du fotar ett headset "Så ska den sätta den automatiskt på headset samt färg"
```
