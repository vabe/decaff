caffparser: main.o caff.o ciff.o toojpeg.o helper.o logger.o
	g++ main.o caff.o ciff.o toojpeg.o helper.o logger.o -o caffparser
	
main.o: main.cpp
	g++ -c main.cpp
	
caff.o: caff.cpp caff.hpp
	g++ -c caff.cpp
	
ciff.o: ciff.cpp ciff.hpp
	g++ -c ciff.cpp
	
toojpeg.o: toojpeg.hpp toojpeg.cpp
	g++ -c toojpeg.cpp
	
helper.o: helper.hpp helper.cpp
	g++ -c helper.cpp

logger.o: logger.hpp logger.cpp
	g++ -c logger.cpp

clean:
	rm *.o caffparser