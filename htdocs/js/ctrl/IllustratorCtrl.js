function Illustrator ($scope){
    $scope.illustrators = [
        {
            "ID" : "Adlpictures",
            "name" : "Adlpictures",
            "website" : "http://adlpictures.deviantart.com/"
        },{
            "ID" : "Alais",
            "name" : "Alaïs",
            "website" : "http://alaisl.deviantart.com/"
        },{
            "ID" : "AnkeEissmann",
            "name" : "Anke Eissmann",
            "website" : "http://www.anke.edoras-art.de"
        },{
            "ID" : "AnnaKulisz",
            "name" : "Anna Kulisz",
            "website" : "http://alasseaearello.deviantart.com/"
        },{
            "ID" : "EbeKastein",
            "name" : "Ebe Kastein",
            "website" : "http://ebe-kastein.deviantart.com/"
        },{
            "ID" : "FrancescoAmadio",
            "name" : "Francesco Amadio",
            "website" : "http://tolmancotton.deviantart.com/"
        },{
            "ID" : "GrantGould",
            "name" : "Grant Gould",
            "website" : "http://www.grantgould.com"
        },{
            "ID" : "JacekKopalski",
            "name" : "Jacek Kopalski",
            "website" : "http://www.jacekkopalski.com"
        },{
            "ID" : "JankaLateckova",
            "name" : "Janka Latečková",
            "website" : "http://jankolas.deviantart.com/"
        },{
            "ID" : "JanPospisil",
            "name" : "Jan Pospíšil",
            "website" : "http://merlkir.deviantart.com/"
        },{
            "ID" : "JennyDolfen",
            "name" : "Jenny Dolfen",
            "website" : "http://www.goldseven.de"
        },{
            "ID" : "JoonaKujanen",
            "name" : "Joona Kujanen",
            "website" : "http://tulikoura.deviantart.com/"
        },{
            "ID" : "Kasiopea",
            "name" : "Katarzyna Karina Chmiel-Gugulska",
            "website" : "http://www.kasiopea.art.pl"
        },{
            "ID" : "KarolinaWegrzyn",
            "name" : "Karolina Węgrzyn",
            "website" : "http://www.sirielle.com"
        },{
            "ID" : "LeoneFabio",
            "name" : "Leone Fabio",
            "website" : "https://www.facebook.com/IllustratorFabioLeone"
        },{
            "ID" : "LigaKlavina",
            "name" : "Līga Kļaviņa",
            "website" : "http://liga-marta.deviantart.com/"
        },{
            "ID" : "LorraineBrevig",
            "name" : "Lorraine Brevig",
            "website" : "http://tolkiengateway.net/wiki/Category:Images_by_Lorraine_Brevig"
        },{
            "ID" : "LuisFBejarano",
            "name" : "Luis F. Bejarano",
            "website" : "http://tolkien.luisbejarano.com/",
            "website2text" : "TG images",
            "website2url" : "http://tolkiengateway.net/wiki/Category:Images_by_Luis_F._Bejarano"
        },{
            "ID" : "Mareishon",
            "name" : "Mareishon",
            "website" : "http://mareishon.deviantart.com/"
        },{
            "ID" : "MaryaFilatova",
            "name" : "Marya Filatova",
            "website" : "http://tolkiengateway.net/wiki/Category:Images_by_Marya_Filatova"
        },{
            "ID" : "MatejCadil",
            "name" : "Matěj Čadil",
            "website" : "http://tolkiengateway.net/wiki/Category:Images_by_Mat%C4%9Bj_%C4%8Cadil"
        },{
            "ID" : "MattStewart",
            "name" : "Matt Stewart",
            "website" : "http://www.matthew-stewart.com"
        },{
            "ID" : "Nolanos",
            "name" : "Nolanos",
            "website" : "http://nolanos.deviantart.com/"
        },{
            "ID" : "OlandaFongSurdenas",
            "name" : "Olanda Fong-Surdenas",
            "website" : "http://wynahiros.deviantart.com/"
        },{
            "ID" : "PeterXavierPrice",
            "name" : "Peter Xavier Price",
            "website" : "http://tolkiengateway.net/wiki/Category:Images_by_Peter_Xavier_Price"
        },{
            "ID" : "RalphDamiani",
            "name" : "Ralph Damiani",
            "website" : "http://www.ralphdamiani.com"
        },{
            "ID" : "RichardSvensson",
            "name" : "Richard Svensson",
            "website" : "http://loneanimator.deviantart.com"
        },{
            "ID" : "SarkaSkorpikova",
            "name" : "Šárka Škorpíková",
            "website" : "http://robleskazeppelin.deviantart.com/",
            "xtraInfo" : "My name is Šárka Škorpíková, born in 1994 and I am a biology student and hobbyist illustrator from the Czech Republic."
        },{
            "ID" : "Shyangell",
            "name" : "Shyangell",
            "website" : "http://shyangell.deviantart.com/"
        },{
            "ID" : "SimonaBrunildeJero",
            "name" : "Simona Brunilde Jero",
            "website" : "http://brunild.deviantart.com/"
        },{
            "ID" : "SoniAlcornHender",
            "name" : "Soni Alcorn-Hender",
            "website" : "http://bohemianweasel.com",
            "xtraInfo" : "Soni is an English artist living and working in Portugal, with a degree in illustration from the Glasgow School of Art.",
            "imgName" : "sonialcornhender"
        }
    ];
    $scope.showImage = function(ilu){
        return (ilu.imgName) ? true : false;
    };
    $scope.showXtraInfo = function(ilu){
        return (ilu.xtraInfo) ? true : false;
    };
    $scope.show2WebLink = function(ilu){
        return (ilu.website2url && ilu.website2text) ? true : false;
    };
}

var ctrl = angular.module('ardamaps.ctrl', [])
        .controller("Illustrator", Illustrator)
    ;