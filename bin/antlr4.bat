:: java -cp "%cd%\antlr4.jar;%CLASSPATH%" org.antlr.v4.Tool -no-listener -visitor -Dlanguage=JavaScript %*
java -cp "%cd%\antlr4.jar;%CLASSPATH%" org.antlr.v4.Tool -no-listener -visitor -Dlanguage=JavaScript -o ../src/app/antlr4 ../src/app/antlr4/Measure.g4
