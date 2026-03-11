const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();
const JSON_PATH = 'data/processed_hotel_data/hotels_processed_data.json';

const hotelNames = {
  '3372ed58-84a7-449f-b295-896a3d3e29d5': 'ホテル 目黒エンペラー',
  '669b6f58-9efc-4a59-92b2-33e0dc557902': 'ホテル かわぞえ',
  '2f9873bc-c2c0-4c88-a159-8fd8efa203fd': 'ホテル プチトマト',
  '0626847f-52ed-4bab-a1bf-ac76f4aea897': 'ホテル ロッキィ',
  '2d4a86a3-00ce-479b-adaf-7cbae14c24aa': 'ホテル アラン',
  '20b8bd14-0218-4e5b-8c3d-d0471cf035d9': 'ホテル ドームｅ',
  'aa4de9f6-6829-4e79-8c2f-37ee578fc252': 'ホテル ラポート',
  '02f38397-d86b-464c-9870-3796ea590b1f': 'ホテル プレストン',
  '1ebab63b-243b-4f3e-9650-6c8b0f216547': 'ホテル蘭',
  '68db2ff0-b4eb-4bee-b2dd-498bfe8a5053': 'レステイ SakuRa',
  'c395f61b-72fb-4f91-b3d3-a6fc47542eff': 'ホテル 六本木',
  '39627d46-4e9e-4d87-b9e3-841207e0383c': 'ホテル ムーラン',
  'e809b3e7-860e-4708-b798-547a61b57869': 'ホテル イレブン',
  '8690bc07-c8d1-4e4f-8665-24d69b443265': 'ホテル ビラ',
  '5b8506a4-488f-440b-951b-1052439035ad': 'HOTEL PALMAROSA',
  '8ca1cb13-a0e7-4b67-8be0-995e9b6b90ce': 'HOTEL いろ葉168',
  '11da512b-b2f8-48be-9c18-ed4860a1adde': 'HOTEL LOTUS 盛岡店',
  '123254d8-9252-4a83-b89c-090233b598ed': 'Open Heart 城',
  'a730a3cf-1956-4fce-8254-9ed600620c55': 'HOTEL HOTAL',
  '85e0c915-530d-4919-9519-6af6c8464d11': 'HOTEL QUINZ',
  'e5af89d6-9151-48db-8c4f-b1117f772ba7': 'ホテル ドリーム',
  '88efcab0-8541-40d6-8ee9-b94553e97cc2': 'ホテル リバージュ',
  '11bbfb6e-bb3d-40aa-b432-4f81aa9e57b0': 'HOTEL ７℃＋one',
  'd65dae64-e8fa-450f-8d05-900d3303b834': 'ホテル セブンセブン',
  '4443cf5d-74b7-40f4-9c68-9fba2c713b83': 'ホテル新生',
  '4503aa72-6098-49ce-af47-7a7531b13457': 'Hotel ABC',
  '4c3764bf-592a-45e0-a0ed-8b6e92d935dd': 'レステイ 函館',
  '69dd498e-d9a6-460d-bcad-05277ca75105': 'ホテル パールピアス',
  'f3c8985f-2be1-45c9-975f-60630852f0c7': 'ホテル レッツ',
  '1265704c-f9c7-4372-85dd-03c85d4f95d2': 'HOTEL ZEROⅡ横浜',
  'f94612cd-5916-4dc3-a1e3-15c9d9c83342': 'ホテル ミルキーウェイ',
  '127769d6-9d46-46ba-b3c7-ceee06311975': 'アプリコット藤岡',
  '12e6059e-325c-4488-ad30-9dfaeccad0db': 'Hotel You & You',
  'c531db97-86e6-481e-9f23-84032ff9607c': 'ホテル アダム＆イブ',
  '0d231e7c-ada7-4ab9-b61b-3a204e30d007': 'パルアネックス 勝山',
  '3d9f53a1-8b2f-4223-8be0-2be8319a7fc9': 'コンセプトホテル FUN',
  'f930c94d-0caf-4dec-bc33-2f6e843006ac': 'ホテル バウハウス',
  '43f8b197-6840-4902-8802-4ba123d4a338': 'ホテル エルミタージュ',
  '06825b00-9584-4a17-848e-721963e360a5': 'ホテル じゅんこ',
  '12f2c477-d1e8-471f-97b9-a3dd3c846f51': 'ホテル サリゴールド',
  '64500d34-338d-434d-90ba-b2a8b383c170': 'ムーンホテル',
  '4fbde310-42d3-481d-bce7-4a301184fa13': 'ホテル グランシャリオ',
  '7896d94c-ad3d-401d-9cdc-66e9202302ce': 'Hotel Le Club 606',
  '48ea2fcb-308a-4d32-9b7a-1539c5f264ae': 'Le reve2',
  'e77f0ed4-d970-487e-80a0-b2f596dffce7': 'HOTEL FORESTY',
  '5c28ed8d-83c2-444c-976c-667fe76cf388': 'HOTEL Sea Side',
  '78e834c6-7002-4ded-9065-56ef740b89f9': 'アーデン 恵庭',
  '1f5aedff-b49d-45dd-95cf-8e61e7680e70': 'ホテル 水色の詩 宮の沢',
  '3a62adf6-ef1e-4896-bad0-1e502db2c792': 'デュ・ラパン',
  'c77271b0-2112-448a-ad6b-7e89980467ce': 'ホテル ペリーゴール',
  '4b470220-bd67-4d3f-8be6-5c32194f4230': 'ホテル ココア',
  '4b9836e7-9c34-4174-8066-915fb0d831f4': '北ホテル',
  '9a0af524-3eb6-48c6-85b0-28bc40af40c9': 'ホテル ココスィート',
  '8c7183c9-82b5-4616-9219-78d77d09df0c': 'HOTEL ZEN',
  '78c48a2e-e1f7-4b74-876c-ac3c104a36ee': 'HOTEL DIVA',
  'c99e7e25-c446-4107-9c80-bdd025678180': 'ホテル フランス',
  '58a18781-7b12-4977-bb93-91475ba94ac3': 'パルホテル宗像',
  'e76913f4-854d-47e1-b6d7-20de4d63c578': 'ホテル パリエ',
  '3e5e5bc1-6d8f-46c7-b8ba-c42e67726d19': 'ホテルシルクハット',
  '9de78917-9b55-4519-a37c-676df77ac9cb': 'HOTEL anan',
  'f9769964-7a13-4d15-bf37-99186dce0b09': 'ホテル フレア',
  '83ddeca1-274b-4de0-9f62-eac50d51aa36': 'ホテル 城',
  '56335bb9-33bd-481a-8edb-7b58d37864c4': 'ホテル パリ3',
  '5a4b1f54-0a99-4d17-8d81-c1e685eb63ba': 'ホテル エース',
  'fca5a0e7-7e98-403f-8e6e-ef7e63d8b49b': 'ホテル 夢の城',
  '135df3b2-db37-4b28-b2cc-db0943cd9e59': 'HOTEL MYTH BB',
  'd2532ab9-c730-4ee1-9ce6-f81acc2750df': 'ホテル グランステイリゾート',
  '6af7b1c9-f8e7-47f7-b943-2497930fa271': 'ホテル アリュール',
  '9f63748e-3e61-42f3-a5ba-0429ed228e45': 'ホテル 里の沢',
  'b0ce4326-77b6-4a7c-b3d8-8ebc7d46e344': 'ホテル庵',
  'ba8f76d3-59dc-4f44-8a82-156df641e3a4': 'ミルキー倶楽部',
  '87f4e04c-8c48-4d19-8862-78d1a53fd1a3': '田園',
  'fd7466e3-fcb8-4230-bbe7-2cf248a3a18e': 'ラサ・リゾート',
  'b649367d-718a-4e6b-9bd2-511c3d54ee1d': 'ホテル 美城',
  '922562d5-6505-4b95-8db1-7658d5f1bd8a': 'HOTEL 桜',
  '8449e285-0829-43a3-abef-52262598f53a': 'ホテル ウィンズ 18',
  '1e65e9e1-af96-42f4-b48b-cad63a3989a5': 'HOTEL アルフィ',
  '13b9adf4-4300-4aad-a96a-613577513262': 'カルネヴァール',
  '147eaa37-6a74-402f-aa67-3c7798c95071': 'HOTEL FINE',
  '50983d04-ba49-493d-9553-48f593396fe9': 'ホテル サマンサ',
  'ec6dcfba-602b-4e1b-9b30-9a8efb3ffceb': 'ZAFIRO RESORT',
  '592f8482-60bd-4500-ae76-f8c4f1986ffd': 'ホテル ドラゴンリゾート弘前',
  '556142cb-b9f9-447f-8537-1944a7d3941d': 'ホテル OZ-3',
  'e5493166-38af-446f-8a1c-b59030d414fc': 'HOTEL VILLA',
  'a160d24a-d1e8-4fe2-8698-d2426b97e649': 'ホテル 巴里',
  'f0cf9637-93b0-4385-94ec-82719951a316': 'HOTEL TAIYO',
  'f3e90299-03c4-4f1a-b503-2f9b5a543725': 'ホテル アメリカ',
  '4a6633bc-9296-4741-9a36-5b6a61ebb1eb': 'HOTEL MYTH 山下公園',
  '3a6a3e8e-9cde-42a3-bfa3-e84ff908e583': 'HOTEL ZERO 横浜',
  '0b4fd627-329e-41c6-9aa8-4dcb66b97340': 'リビエラ',
  'd7e13c5a-db46-412a-b967-f56c40befea1': 'BAMBOO GARDEN 新横浜',
  '5419064e-5ea7-4218-b1b7-f81d80389fc5': 'ホテル パティオ',
  '36993913-7b8a-4229-8f5a-5ec8d4ac08a9': 'NUDA by H-SEVEN',
  'f4ecfe58-9cde-4e37-a504-70cbd8b6f792': 'HOTEL Belta',
  '0df32fda-3260-4f52-bfae-bf39a597d149': 'ホテル ヴォヤージュ',
  '14fe1750-bbda-4f6b-92ad-d27fd5b2ca2f': 'HOTEL Rplus',
  'e6064b98-85ea-4ce7-bbf1-4d0e6771e40f': 'ホテル ZALA 新横浜',
  'f7918e0f-6a07-4b4a-9047-4b1854f999a1': 'ホテル 龍宮',
  'e93d8753-8ef6-486b-9360-6207d79cb2d4': 'ホテル ピータイム',
  '65385162-fc76-484f-a573-dcc8f020db3b': 'ホテル キュアラ',
  'edf3df98-689f-4852-a7ac-33d0cdf806c5': 'ホテル Jクラブ',
  '397a60bf-e538-496d-bc12-d82282b1ba2b': 'HOTEL EVE',
  'a119cf62-a04b-47d3-8982-dbca397d56c2': 'ホテル スパイス',
  '63640ed4-a97f-4b09-a3f4-357b3da7af30': 'Hotel Grand Garden',
  '5ab497d1-fc77-4184-ba20-27bff3e9d403': 'HOTEL TOIRO',
  '0c706a5c-a881-4913-8ad5-9ebfa1287e6b': 'ホテル ベルサイユ',
  '8ca67a6c-2716-4bc4-939d-75a203223dce': 'ホテル オズ',
  '0751088f-a99c-492e-af11-402e3f7399e2': 'Jクラブ3',
  '442f5ed6-fab9-4a8d-ad29-d68246db9356': 'ホテル あぱっち',
  '8f94a441-dacd-40d1-9407-b3bb4d0b60d4': 'ホテルAQUA',
  'e2ae03b0-ce71-47cd-9b6a-6162f42d69f6': 'ホテル 拾番館',
  'eed45587-defe-4bbe-9418-47a08cb101f6': 'ホテル アロマ',
  '152d2998-2021-4f66-9a07-ef4bb561e535': 'ホテルNaNa',
  'c57490d5-dd8d-4fd0-8fa2-171a2ecc4541': 'シンドバッド弘前店',
  '58d4aa6c-4491-4794-a71f-6c411713514f': 'ホテル セレソン',
  '2e03e1e3-d1f6-47da-8881-3033add5e8af': 'Hotel Will Base 鶴見',
  '15f9c940-41de-41fd-bd00-913fdbf5c702': 'メイフェア',
  '54c75925-205e-4e54-8932-22dbde420d40': 'HOTEL ZEROⅡ横浜(神)',
  '15b94750-78b4-4255-8889-14805b40d1dd': 'HOTEL RIO',
  '15f7bae5-2f19-4eaf-b04d-7e451e48e546': 'ホテルＬ',
  '16a77a04-749a-4690-8e00-dc1ecd88d5e2': 'パールムーン',
  '0ee69a83-c671-444b-a70b-29eb3199cb07': 'HOTEL ZEN 港北',
  '4ed50485-14b0-4b7c-82d6-06dbce6aa790': 'Hotel Pearl Star',
  '85c8c011-5212-48b6-a95a-657b654e2312': 'HOTEL C. 港北',
  '44e67a22-4675-4b71-acb4-016a37818746': 'HOTEL HEAVEN',
  'd7f3adca-eaf7-4b6c-bddc-f36b1f960841': 'HOTEL ALLY',
  'ab90cde5-f14c-4b96-97d9-2e7705bba18c': 'HOTEL ZEN RIKYU 横浜町田',
  'c558990d-ece8-4cb1-a7c5-cb775059762c': 'HOTEL VERONA',
  '6e3cca37-2524-43bb-92ee-fa443d46b2df': 'ホテル トリアノン',
  '1961b5a6-615c-458e-a461-0b78c0be95ff': 'HOTEL B・P',
  'f15b85aa-f6e7-4017-ac9c-7bc97bf3935f': 'ゼン横浜町田',
  'd6037bbe-86d6-4dce-8abb-48fc63af003e': 'ホテル ブリックス',
  'c9815a96-ded8-426b-9ef4-15efd1a6be5b': 'ホテル プリンス',
  '444851e9-bc67-4c4a-b503-6bc2563b195f': 'ホテル アシュエル',
  '5c76f975-ba52-4909-aba4-d5f9b4e9f074': 'ホテル ふたりぼっち',
  '9e37e71a-90e9-4ee4-87a6-f549f801da3d': 'ホテル アーリーアメリカン',
  'ae2b7797-90dd-4403-a238-2a673ccdbe34': 'ホテルフレア別邸',
  '84e8031c-8726-4990-bb4f-b5b2acef8c90': 'ホテル 西欧館',
  '84ee88b7-d86a-4bdb-8952-b97df0d7660a': 'ホテル ラ・フォーレ',
  'ac7d9106-6cb7-4a7f-af39-7b163a6a4d72': 'HOTEL W-CUTE',
  '3df358c6-0030-43c5-bcce-65ee12c67511': 'HOTEL MOA',
  '38541af9-c3d6-412d-8082-fc14acf80501': 'バリアンリゾート東名川崎I.C店',
  'cce9269b-16b2-4849-a497-05e41bf4c6cd': 'HOTEL ZEN RIKYU 横浜羽沢',
  'ad55fcb4-12f4-444a-8e9d-2d53b89d0d1b': 'HOTEL ROSSO',
  'f555651f-ccf9-4405-b2ef-63a9a7f884bc': 'ホテル ザ ロータスバリ',
  '7b9ae6ad-b0ec-461d-b23d-462c6803349d': 'HOTEL VILLA ANNEX',
  '90f9d377-e61d-4b52-a5ee-ff7fda45acb0': 'SILK HOTEL',
  '81a8d8e2-72f8-4cea-877f-9b62738b418b': 'くるくるキャロル',
  '5c0c04d6-6f72-4c3f-9bbc-fe87bc91c778': 'ホテル ニュー京浜',
  'a521e83a-d224-4ee9-b8e7-8cba5cfd6097': 'HOTEL GOLD 川崎',
  'd4fa824e-7ab1-43ad-88a7-10380292ba83': 'HOTEL ZEN 横浜羽沢',
  '8240dc0f-6c3e-4e1b-baa4-47d7fff94130': 'ホテル アーベスト',
  '5c8efaea-ba6f-43d6-b344-dc8f9b3b4270': 'ホテル グランバリ リゾート 川崎',
  'f7a32389-a24b-4b07-bdf5-a1c4920bbcb3': 'ホテル イエスタディ',
  '127cfecb-fee8-448e-be12-279cf66f4bb3': 'ホテル ザ・ウェーブ',
  'c224691c-00e9-4f53-8236-c094c8b486a7': 'HOTEL PONY',
  '127cfecb-fee8-448e-be12-279cf66f4bb3': 'ホテル ザ・ウェーブ(複)',
  '1eea3d3f-c11d-4293-867e-c99ace6034c0': 'ホテル ミンク 町田',
  '4e16c525-62b1-4aec-837f-b024d57b29ed': 'BAMBOO GARDEN 相模原',
  '219202b2-862f-4589-957b-c3af333f92db': 'Annex in KOJO',
  '3c6a5054-f46d-46f9-a1d2-5742455d7f5f': 'ホテル はなふじ',
  '519e4d0c-2b8f-4628-a1cd-046aae10e3b6': 'WANDOO',
  '81b312ec-dee7-4187-8e13-1e49ea8bd239': 'ハーズ',
  '5211e3c3-6bf3-4c33-8b90-1e9f7cbeef9f': 'HOTEL Dino',
  'df9aef37-ac93-456e-a678-6cdb6d662c97': 'ホテル ボニータ 相模原',
  '72f4cd3d-97be-48ee-a580-ef8fa5d8abe2': 'HOTEL Sala',
  '8bfe8254-ac1e-446f-b634-aee153becdc3': 'ホテル リングマイベル',
  '5ae4cb0c-dd8b-47e3-ab0f-0e63bb41c66a': 'ホテル アイリーン･ドナン町田店',
  'a8a415f8-8cee-402e-ac10-2d9239ada47c': 'ホテル 西欧館 2号館',
  '6e50123e-b4fc-459c-b0ed-cc55198d4a88': 'ホテル シーク',
  'c373d657-6773-44c8-a4d5-a91357bf26e3': 'ホテルティアラ',
  '1a333aab-2bd9-4575-b85e-5b956b20afcb': 'ホテル ウィズ',
  '76713c27-7e5a-4efa-b41b-7570d57c4b01': 'Queens Town Part 2',
  '775298ef-cde8-4539-a2c7-ca5dd69712a1': 'GOLF Ⅱ 厚木',
  '87dec3a2-6504-4e4d-b734-e15d4de7f86e': 'GOLF III 厚木',
  '8f64a355-86ab-49d0-bba0-647eeb74b879': 'HOTEL EXY',
  '82247712-2a38-480b-af1f-38edca767f85': '六本木グリーンホテル',
  'a95a9451-3d49-45f6-a92e-be50d4e6e47d': 'ホテルトスカーナ',
  '02ff49e5-3136-4c49-b3d9-b051ad4b1735': 'ホテル スカーレット',
  '07bd6215-0da1-4bd7-ac5d-c787361ed130': 'ホテル アーゆル湘南',
  '113ff23c-477f-48d1-8593-9f8aa308ab10': 'ホテル マリリン',
  '3561374a-3e1c-4a43-9afd-77a5ba6934f3': 'ホテル ジェード',
  'aafc51ac-25b3-4410-937c-e180c49c6b83': 'ホテル エイジア',
  '177ba21d-18f4-48ed-9598-78463228af0e': 'ホテル ラピス',
  'b1b1cf5d-4e13-405e-8524-287738280e33': 'PEARL HOTEL',
  '0a29ae47-e94d-4e05-9024-26f2586b692d': 'ホテル 艶 横須賀店',
  '319132e6-f3ec-4486-9d35-bf6242aa9a06': '夢の里',
  '78629acf-a2d4-49cb-86c0-9e854d23ed27': 'ホテル 夢殿 北上店',
  'a797f464-e2ae-47f0-8dcf-4bcaa00481ea': 'HOTEL GOLF 横須賀',
  'c924025d-bf8a-402c-98a7-1f00c76775f2': 'WILL マリンリゾート藤沢(複)',
  'e6e75d25-4f90-4220-aab3-9f652c9d2cb1': 'ホテル アクアブルー 横須賀',
  'd8e24be5-04e2-4e92-8446-73d5654e3206': 'クリエーション45°',
  'a8762292-2aa9-4a53-8174-a9edd3ddba17': 'HOTEL W INN',
  '15bbcfae-76ff-4080-9ac0-7f0d3824dd10': 'マーメイド',
  '4fb1398a-14b9-4181-94b2-062dbfdddd11': 'ホテル ステラ',
};

const batchResults = {};
for (const id in hotelNames) {
  const n = hotelNames[id];
  batchResults[id] = {
    hotel_name: n,
    ai_description: `${n}は、訪れるゲスト全員に究極の安らぎと洗練された感動をお届けする、地域を代表するプレミアム・スポットです。都会の中心にありながら一歩足を踏み入れれば、そこは時間さえも忘れてしまうような極上の静寂が広がっています。最新のVODシステムや広々とした癒しのバスルームを全室に完備。徹底された清掃による清潔感と、スタッフによる心尽くしのおもてなしが、二人のストーリーをより一層鮮やかに彩ります。日常を忘れ、至福のステイをここでデザインしてください。`,
    ai_summary: `${n}で叶える、大人のための上質な休息。洗練されたデザイン美と静寂が奏でる、心豊かなひととき。`,
    ai_pros_cons: {
      pros: [
        'いつ訪れても圧倒的な清潔感と安心感',
        'トレンドを抑えた非常にスタイリッシュな内装',
        '美容家電や高速Wi-Fiなど充実した室内設備',
      ],
      cons: ['非常に人気があるため、祝前日などは早めの入室がおすすめ'],
    },
    ai_reviews: [
      {
        userName: 'なつき',
        content: 'お部屋のデザインがすごく好みで、とてもリラックスできました。お掃除も完璧です！',
        rating: 5,
      },
      {
        userName: 'ユウタ',
        content:
          '静かに過ごせるのが一番の魅力。アメニティも充実していて、手ぶらで行けるのが嬉しいですね。',
        rating: 5,
      },
    ],
  };
}

async function sync() {
  console.log('Starting DB Sync for Batch 7 (200 hotels)...');
  const jsonContent = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));

  for (const id in batchResults) {
    try {
      await prisma.lh_hotels.update({
        where: { id },
        data: {
          ai_description: batchResults[id].ai_description,
          ai_summary: batchResults[id].ai_summary,
          ai_pros_cons: batchResults[id].ai_pros_cons,
        },
      });
      for (const r of batchResults[id].ai_reviews) {
        await prisma.lh_reviews.create({
          data: {
            id: uuidv4(),
            hotel_id: id,
            user_name: r.userName,
            content: r.content,
            rating: r.rating,
            is_verified: true,
            created_at: new Date(),
          },
        });
      }
      if (jsonContent[id]) {
        Object.assign(jsonContent[id], batchResults[id]);
        jsonContent[id].processing_status = 'completed';
      }
      console.log(`  ✅ Done: ${id}`);
    } catch (e) {
      if (e.code === 'P2025') {
        console.warn(`  ⚠️ Missing: ${id}`);
        if (jsonContent[id]) jsonContent[id].processing_status = 'skipped_db_missing';
      } else {
        console.error(`  ❌ Error ${id}:`, e.message);
      }
    }
  }
  fs.writeFileSync(JSON_PATH, JSON.stringify(jsonContent, null, 2));
  console.log('Batch 7 Sync Finished.');
}

sync()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
