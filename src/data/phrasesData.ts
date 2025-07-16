import type { PhrasesResponse } from '../types';

export const phrasesData: PhrasesResponse = {
  "japanese_phrases": {
    "learning_japanese": [
      {
        "english": "Please repeat that",
        "japanese": "もう一度言ってください",
        "hiragana": "もういちどいってください",
        "romaji": "mou ichido itte kudasai",
        "explanation": "Polite request to have someone repeat what they just said",
        "word_breakdown": {
          "もう": "mou - already/again",
          "一度": "ichido - once/one time",
          "言って": "itte - to say (te-form)",
          "ください": "kudasai - please (polite request)"
        }
      },
      {
        "english": "Please speak slowly",
        "japanese": "ゆっくり話してください",
        "hiragana": "ゆっくりはなしてください",
        "romaji": "yukkuri hanashite kudasai",
        "explanation": "Polite request for someone to speak at a slower pace",
        "word_breakdown": {
          "ゆっくり": "yukkuri - slowly/leisurely",
          "話して": "hanashite - to speak (te-form)",
          "ください": "kudasai - please (polite request)"
        }
      },
      {
        "english": "How do you say this in Japanese?",
        "japanese": "これは日本語で何と言いますか",
        "hiragana": "これはにほんごでなんといいますか",
        "romaji": "kore wa nihongo de nan to iimasu ka",
        "explanation": "Question to ask how to express something in Japanese, often used while pointing",
        "word_breakdown": {
          "これ": "kore - this",
          "は": "wa - topic particle",
          "日本語": "nihongo - Japanese language",
          "で": "de - particle indicating method/means",
          "何": "nan - what",
          "と": "to - quotation particle",
          "言います": "iimasu - to say (polite form)",
          "か": "ka - question particle"
        }
      },
      {
        "english": "I don't understand",
        "japanese": "分かりません",
        "hiragana": "わかりません",
        "romaji": "wakarimasen",
        "explanation": "Polite way to express that you don't understand something",
        "word_breakdown": {
          "分かり": "wakari - to understand (stem form)",
          "ません": "masen - negative polite ending"
        }
      },
      {
        "english": "What does this mean?",
        "japanese": "これはどういう意味ですか",
        "hiragana": "これはどういういみですか",
        "romaji": "kore wa dou iu imi desu ka",
        "explanation": "Question to ask about the meaning of something",
        "word_breakdown": {
          "これ": "kore - this",
          "は": "wa - topic particle",
          "どう": "dou - how",
          "いう": "iu - to say",
          "意味": "imi - meaning",
          "です": "desu - polite copula",
          "か": "ka - question particle"
        }
      },
      {
        "english": "Can you write it down?",
        "japanese": "書いてもらえますか",
        "hiragana": "かいてもらえますか",
        "romaji": "kaite moraemasu ka",
        "explanation": "Polite request to have someone write something down for you",
        "word_breakdown": {
          "書いて": "kaite - to write (te-form)",
          "もらえます": "moraemasu - can receive (potential form of morau)",
          "か": "ka - question particle"
        }
      }
    ],
    "asking_directions": [
      {
        "english": "Excuse me, where is the station?",
        "japanese": "すみません、駅はどこですか",
        "hiragana": "すみません、えきはどこですか",
        "romaji": "sumimasen, eki wa doko desu ka",
        "explanation": "Polite way to ask for directions to the train station",
        "word_breakdown": {
          "すみません": "sumimasen - excuse me/sorry",
          "駅": "eki - station",
          "は": "wa - topic particle",
          "どこ": "doko - where",
          "です": "desu - polite copula",
          "か": "ka - question particle"
        }
      },
      {
        "english": "How do I get to Tokyo Station?",
        "japanese": "東京駅へはどうやって行きますか",
        "hiragana": "とうきょうえきへはどうやっていきますか",
        "romaji": "toukyou eki e wa dou yatte ikimasu ka",
        "explanation": "Question asking for directions or method to reach Tokyo Station",
        "word_breakdown": {
          "東京駅": "toukyou eki - Tokyo Station",
          "へ": "e - direction particle (to/towards)",
          "は": "wa - topic particle",
          "どう": "dou - how",
          "やって": "yatte - doing (te-form of yaru)",
          "行きます": "ikimasu - to go (polite form)",
          "か": "ka - question particle"
        }
      },
      {
        "english": "Is it far from here?",
        "japanese": "ここから遠いですか",
        "hiragana": "ここからとおいですか",
        "romaji": "koko kara tooi desu ka",
        "explanation": "Question to ask if a destination is far from the current location",
        "word_breakdown": {
          "ここ": "koko - here",
          "から": "kara - from",
          "遠い": "tooi - far/distant",
          "です": "desu - polite copula",
          "か": "ka - question particle"
        }
      },
      {
        "english": "Turn right at the traffic light",
        "japanese": "信号で右に曲がってください",
        "hiragana": "しんごうでみぎにまがってください",
        "romaji": "shingou de migi ni magatte kudasai",
        "explanation": "Direction instruction to turn right at a traffic light",
        "word_breakdown": {
          "信号": "shingou - traffic light",
          "で": "de - particle indicating location of action",
          "右": "migi - right",
          "に": "ni - direction particle",
          "曲がって": "magatte - to turn (te-form)",
          "ください": "kudasai - please"
        }
      },
      {
        "english": "Go straight for about 5 minutes",
        "japanese": "5分ぐらいまっすぐ行ってください",
        "hiragana": "ごふんぐらいまっすぐいってください",
        "romaji": "gofun gurai massugu itte kudasai",
        "explanation": "Direction instruction to continue straight for approximately 5 minutes",
        "word_breakdown": {
          "5分": "gofun - 5 minutes",
          "ぐらい": "gurai - about/approximately",
          "まっすぐ": "massugu - straight",
          "行って": "itte - to go (te-form)",
          "ください": "kudasai - please"
        }
      },
      {
        "english": "It's on the left side",
        "japanese": "左側にあります",
        "hiragana": "ひだりがわにあります",
        "romaji": "hidari gawa ni arimasu",
        "explanation": "Statement indicating something is located on the left side",
        "word_breakdown": {
          "左": "hidari - left",
          "側": "gawa - side",
          "に": "ni - location particle",
          "あります": "arimasu - to exist/be located (polite form)"
        }
      }
    ],
    "meeting_new_people": [
      {
        "english": "Nice to meet you",
        "japanese": "はじめまして",
        "hiragana": "はじめまして",
        "romaji": "hajimemashite",
        "explanation": "Standard greeting when meeting someone for the first time",
        "word_breakdown": {
          "はじめ": "hajime - beginning/first time",
          "まして": "mashite - polite ending for greetings"
        }
      },
      {
        "english": "My name is [name]",
        "japanese": "私の名前は[名前]です",
        "hiragana": "わたしのなまえは[なまえ]です",
        "romaji": "watashi no namae wa [namae] desu",
        "explanation": "Way to introduce your name to someone",
        "word_breakdown": {
          "私": "watashi - I/me",
          "の": "no - possessive particle",
          "名前": "namae - name",
          "は": "wa - topic particle",
          "です": "desu - polite copula"
        }
      },
      {
        "english": "Where are you from?",
        "japanese": "どちらの出身ですか",
        "hiragana": "どちらのしゅっしんですか",
        "romaji": "dochira no shusshin desu ka",
        "explanation": "Polite question to ask about someone's hometown or country of origin",
        "word_breakdown": {
          "どちら": "dochira - which (polite form)",
          "の": "no - possessive particle",
          "出身": "shusshin - birthplace/hometown",
          "です": "desu - polite copula",
          "か": "ka - question particle"
        }
      },
      {
        "english": "I'm from America",
        "japanese": "アメリカから来ました",
        "hiragana": "あめりかからきました",
        "romaji": "amerika kara kimashita",
        "explanation": "Statement indicating you came from America",
        "word_breakdown": {
          "アメリカ": "amerika - America",
          "から": "kara - from",
          "来ました": "kimashita - came (past tense of kuru, polite form)"
        }
      },
      {
        "english": "What do you do for work?",
        "japanese": "お仕事は何をされていますか",
        "hiragana": "おしごとはなにをされていますか",
        "romaji": "oshigoto wa nani wo sarete imasu ka",
        "explanation": "Polite question about someone's occupation",
        "word_breakdown": {
          "お仕事": "oshigoto - work/job (polite form)",
          "は": "wa - topic particle",
          "何": "nani - what",
          "を": "wo - object particle",
          "されて": "sarete - doing (respectful form)",
          "います": "imasu - continuous form",
          "か": "ka - question particle"
        }
      },
      {
        "english": "Please take care of me",
        "japanese": "よろしくお願いします",
        "hiragana": "よろしくおねがいします",
        "romaji": "yoroshiku onegaishimasu",
        "explanation": "Standard phrase used when meeting someone new or asking for ongoing support",
        "word_breakdown": {
          "よろしく": "yoroshiku - favorably/well",
          "お願い": "onegai - request/favor",
          "します": "shimasu - to do (polite form)"
        }
      },
      {
        "english": "How old are you?",
        "japanese": "おいくつですか",
        "hiragana": "おいくつですか",
        "romaji": "oikutsu desu ka",
        "explanation": "Polite way to ask someone's age",
        "word_breakdown": {
          "お": "o - honorific prefix",
          "いくつ": "ikutsu - how many/how old",
          "です": "desu - polite copula",
          "か": "ka - question particle"
        }
      },
      {
        "english": "Do you have any hobbies?",
        "japanese": "趣味はありますか",
        "hiragana": "しゅみはありますか",
        "romaji": "shumi wa arimasu ka",
        "explanation": "Question to ask about someone's hobbies or interests",
        "word_breakdown": {
          "趣味": "shumi - hobby/interest",
          "は": "wa - topic particle",
          "あります": "arimasu - to have/exist (polite form)",
          "か": "ka - question particle"
        }
      }
    ]
  }
};
