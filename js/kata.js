(function(){
	var app = angular.module('myKata', ['ui.router']);
	app.controller('KataController', ['$scope', '$http', '$sce', function($scope, $http, $sce) {
		var self = this;
		self.score = 0;
		self.activeQuestion = -1;
		self.activeQuestionAnswered = 0;
		self.percentage = 0;
		
		$http.get('quiz_data.json').then(function(quizData) {
			self.myQuestions = quizData.data;
			self.totalQuestions = self.myQuestions.length;
		});
		
		self.selectAnswer = function(qIndex, aIndex) {	
			//qIndex is the $index of the question, and the aIndex is the $index of the answer
		
			
			
			if (self.myQuestions[qIndex].type === 'quiz') {
				var questionState = self.myQuestions[qIndex].questionState;
				
				if (questionState !== 'answered') {
					self.myQuestions[qIndex].selectedAnswer = aIndex;
					var correctAnswer = self.myQuestions[qIndex].correct;
					self.myQuestions[qIndex].correctAnswer = correctAnswer;

					if (correctAnswer === aIndex ) {
						self.myQuestions[qIndex].correctness = 'correct';
						self.score += 1;
					} else {
						self.myQuestions[qIndex].correctness = 'incorrect';
					}
					self.myQuestions[qIndex].questionState = 'answered';
				}

				self.percentage = ((self.score / self.totalQuestions) * 100).toFixed(1);
			}		
		};
		
		self.understand = function(qIndex, aIndex) {	
			var answer = self.myQuestions[qIndex].answers[aIndex];
			
			if (answer.understandState === undefined) {
				answer.understandState = 'known';
			} else {
				if (answer.understandState === 'unknown') {
					answer.understandState = 'known';
				} else {
					answer.understandState = 'unknown';
				}
			}	
			
			if (self.fullyUnderstand(qIndex, aIndex)) {
				var question = self.myQuestions[qIndex];
				question.questionState = 'answered';
				question.correctness = 'correct';
			} else {
				question.questionState = 'unanswered';
				question.correctness = '';
			}
		};
		
		self.getUnderstandState = function(qIndex, aIndex) {
			var understandState = self.myQuestions[qIndex].answers[aIndex].understandState || 'unknown';
			return understandState;
		};
		
		self.fullyUnderstand = function(qIndex, aIndex) {
			var answers = self.myQuestions[qIndex].answers;
			var i = 0;
			for (; i < answers.length; i++) {
				if (answers[i].understandState === undefined || answers[i].understandState === 'unknown') {
					return false;
				}
			}
			
			return true;
		}
		
		self.isSelected = function(qIndex, aIndex) {
			return self.myQuestions[qIndex].selectedAnswer === aIndex;
		};
		
		self.isCorrect = function(qIndex, aIndex) {
			return self.myQuestions[qIndex].correctAnswer === aIndex;
		};
		
		self.selectContinue = function() {
			return self.activeQuestion += 1;
		};
		
		self.createShareLinks = function(percentage) {
			var url = 'https://philipdai.github.com';
			var emailLink = '<a class="btn email" href="mailto:?subject=Try to beat my score!&amp;body=I scored a '+ percentage +'% on the kata about AngularJS on Black Cat Kata. Try to beat my score at '+ url +'">Email to a friend</a>';
			var twitterLink = '<a class="btn twitter" target="_blank" href="http://twitter.com/share?text=I scored a '+ percentage +'% on this kata about AngularJS on Black Cat Kata. Try to beat my score at &amp;hashtages=AngularJSKata&amp;url='+ url +'">Twitter your score</a>';
			var newMarkup = emailLink + twitterLink;
			return $sce.trustAsHtml(newMarkup);
		}
		
	}]);
	
})();