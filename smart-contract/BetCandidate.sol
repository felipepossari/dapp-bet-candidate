// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

struct Bet {
    uint256 amount;
    uint256 candidate;
    uint256 timestamp;
    uint256 claimed;
}

struct Dispute {
    string candidate1;
    string candidate2;
    string image1;
    string image2;
    uint256 total1;
    uint256 total2;
    uint256 winner;
}

contract BetCandidade {
    Dispute public dispute;
    mapping(address => Bet) public allBets;
    uint256 public netPrize;

    address owner;
    uint256 fee = 1000;

    constructor() {
        owner = msg.sender;
        dispute = Dispute({
            candidate1: "Donald Trump",
            candidate2: "Kamala Harris",
            image1: "https://pt.wikipedia.org/wiki/Donald_Trump#/media/Ficheiro:Donald_Trump_official_portrait.jpg",
            image2: "https://pt.wikipedia.org/wiki/Kamala_Harris#/media/Ficheiro:Kamala_Harris_Vice_Presidential_Portrait.jpg",
            total1: 0,
            total2: 0,
            winner: 0
        });
    }

    function bet(uint256 candidate) external payable {
        require(candidate == 1 || candidate == 2, "Invalid candidate");
        require(msg.value > 0, "Invalid bet");
        require(dispute.winner == 0, "Dispute closed");
        // require(allBets[msg.sender].amount == 0, "Voted already");

        Bet memory newBet = Bet({
            amount: msg.value,
            candidate: candidate,
            timestamp: block.timestamp,
            claimed: 0
        });

        allBets[msg.sender] = newBet;

        if (candidate == 1) {
            dispute.total1 += msg.value;
        } else {
            dispute.total2 += msg.value;
        }
    }

    function finish(uint256 winner) external {
        require(msg.sender == owner, "Invalid account");
        require(winner == 1 || winner == 2, "Invalid candidate");
        require(dispute.winner == 0, "Dispute closed");

        dispute.winner = winner;

        uint256 grossPrize = dispute.total1 + dispute.total2;
        uint256 commision = (grossPrize * fee) / 1e4;
        netPrize = grossPrize - commision;

        payable(owner).transfer(commision);
    }

    function claim() external {
        Bet memory userBet = allBets[msg.sender];
        require(
            dispute.winner > 0 &&
                dispute.winner == userBet.candidate &&
                userBet.claimed == 0
        );

        uint256 winnerAmount = dispute.winner == 1
            ? dispute.total1
            : dispute.total2;
        uint ratio = (userBet.amount * 1e4) / winnerAmount;
        uint individualPrize = netPrize * ratio / 1e4;
        allBets[msg.sender].claimed = individualPrize;
        payable(msg.sender).transfer(individualPrize);
        
    }
}
